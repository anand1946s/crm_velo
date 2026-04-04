import discord
from discord.ext import commands
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API = os.getenv("API_BASE")


# ───────────────── MODAL ─────────────────

class AddPersonModal(discord.ui.Modal, title="Add Person"):

    name = discord.ui.TextInput(label="Name")
    email = discord.ui.TextInput(label="Email")
    phone = discord.ui.TextInput(label="Phone")
    dob = discord.ui.TextInput(
        label="DOB (YYYY-MM-DD, optional)",
        required=False
    )

    def __init__(self, person_type: str):
        super().__init__()
        self.person_type = person_type

    async def on_submit(self, interaction: discord.Interaction):

        try:
            print("Modal submitted")

            data = {
                "name": self.name.value,
                "email": self.email.value,
                "phone": self.phone.value,
                "type": self.person_type,
            }

            if self.dob.value:
                data["dob"] = self.dob.value

            print("DATA =", data)

            r = requests.post(
                f"{API}/persons/",
                json=data
            )

            print("STATUS =", r.status_code)
            print("RESPONSE =", r.text)

            await interaction.response.send_message(
                "Done",
                ephemeral=True
            )

        except Exception as e:

            print("ERROR:", e)

            await interaction.response.send_message(
                str(e),
                ephemeral=True
            )


# ───────────────── TYPE SELECT ─────────────────

class TypeSelect(discord.ui.Select):

    def __init__(self):
        options = [
            discord.SelectOption(label="Member",  value="MEMBER"),
            discord.SelectOption(label="Alumni",  value="ALUMNI"),
            discord.SelectOption(label="Mentor",  value="MENTOR"),
        ]
        super().__init__(placeholder="Select person type...", options=options)

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.send_modal(AddPersonModal(person_type=self.values[0]))


class TypeSelectView(discord.ui.View):

    def __init__(self):
        super().__init__(timeout=60)
        self.add_item(TypeSelect())


# ───────────────── PAGINATION VIEW ─────────────────

class PersonListView(discord.ui.View):
    def __init__(self, api, per_page=20):
        super().__init__(timeout=60)
        self.api = api
        self.page = 0
        self.per_page = per_page

    def fetch(self):
        skip = self.page * self.per_page

        r = requests.get(
            f"{self.api}/persons/",
            params={"skip": skip, "limit": self.per_page}
        )

        if r.status_code != 200:
            return [{"name": "ERROR", "email": r.text}]

        return r.json()

    def format(self, data):
        if not data:
            return "No persons found."

        text = ""
        for i, p in enumerate(data, start=1 + self.page*self.per_page):
            text += (
                f"{i}. **{p['name']}**\n"
                f"   Email: {p['email']}\n"
                f"   Phone: {p['phone']}\n"
                f"   Type: {p['type']}\n\n"
            )

        return text

    @discord.ui.button(label="Prev", style=discord.ButtonStyle.secondary)
    async def prev(self, interaction: discord.Interaction, button: discord.ui.Button):
        if self.page > 0:
            self.page -= 1

        data = self.fetch()
        await interaction.response.edit_message(content=self.format(data), view=self)

    @discord.ui.button(label="Next", style=discord.ButtonStyle.primary)
    async def next(self, interaction: discord.Interaction, button: discord.ui.Button):
        self.page += 1

        data = self.fetch()

        if not data:
            self.page -= 1
            await interaction.response.edit_message(
                content="No more persons.",
                view=self
            )
            return

        await interaction.response.edit_message(content=self.format(data), view=self)


# ───────────────── COG ─────────────────

class Persons(commands.Cog):

    def __init__(self, bot):
        self.bot = bot

    @discord.app_commands.command(
        name="addperson",
        description="Add a person"
    )
    async def addperson(self, interaction: discord.Interaction):
        await interaction.response.send_message(
            "Select a type for the person:",
            view=TypeSelectView(),
            ephemeral=True
        )

    @discord.app_commands.command(
        name="listpersons",
        description="View persons"
    )
    async def listpersons(self, interaction: discord.Interaction):

        view = PersonListView(API)

        data = view.fetch()

        await interaction.response.send_message(
            content=view.format(data),
            view=view,
            ephemeral=True
        )


async def setup(bot):
    await bot.add_cog(Persons(bot))