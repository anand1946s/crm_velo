import discord
from discord.ext import commands
import os
import requests
from dotenv import load_dotenv

load_dotenv()
API = os.getenv("API_BASE")


# ───────────────── MODAL ─────────────────

class AddProjectModal(discord.ui.Modal, title="Add Project"):

    name = discord.ui.TextInput(label="Project Name")
    description = discord.ui.TextInput(label="Description")
    start_date = discord.ui.TextInput(label="Start Date", required=False)

    def __init__(self, status: str):
        super().__init__()
        self.status = status

    async def on_submit(self, interaction: discord.Interaction):

        data = {
            "name": self.name.value,
            "description": self.description.value,
            "status": self.status,
        }

        if self.start_date.value:
            data["start_date"] = self.start_date.value

        try:
            r = requests.post(f"{API}/projects/", json=data)

            if r.status_code in [200, 201]:
                msg = "Project created successfully"
            else:
                msg = f"Failed: {r.text}"

        except Exception as e:
            msg = f"Error: {str(e)}"

        await interaction.response.send_message(msg, ephemeral=True)


# ───────────────── STATUS SELECT ─────────────────

class StatusSelect(discord.ui.Select):

    def __init__(self):
        options = [
            discord.SelectOption(label="In Progress",  value="IN_PROGRESS"),
            discord.SelectOption(label="Completed",    value="COMPLETED"),
            discord.SelectOption(label="Aborted",      value="ABORTED"),
        ]
        super().__init__(placeholder="Select project status...", options=options)

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.send_modal(AddProjectModal(status=self.values[0]))


class StatusSelectView(discord.ui.View):

    def __init__(self):
        super().__init__(timeout=60)
        self.add_item(StatusSelect())


# ───────────────── PAGINATION VIEW ─────────────────

class ProjectListView(discord.ui.View):
    def __init__(self, api, per_page=5):
        super().__init__(timeout=60)
        self.api = api
        self.page = 0
        self.per_page = per_page

    def fetch(self):
        skip = self.page * self.per_page

        try:
            r = requests.get(
                f"{self.api}/projects/",
                params={"skip": skip, "limit": self.per_page}
            )

            if r.status_code != 200:
                return []

            return r.json()

        except Exception:
            return []

    def format(self, data):
        if not data:
            return "No projects found."

        text = ""
        start_index = self.page * self.per_page

        for i, p in enumerate(data, start=start_index + 1):
            text += f"{i}. **{p['name']}** | {p['status']}\n"

        return text

    @discord.ui.button(label="Prev", style=discord.ButtonStyle.secondary)
    async def prev(self, interaction: discord.Interaction, button: discord.ui.Button):

        if self.page > 0:
            self.page -= 1

        data = self.fetch()

        await interaction.response.edit_message(
            content=self.format(data),
            view=self
        )

    @discord.ui.button(label="Next", style=discord.ButtonStyle.primary)
    async def next(self, interaction: discord.Interaction, button: discord.ui.Button):

        self.page += 1
        data = self.fetch()

        if not data:
            self.page -= 1
            await interaction.response.edit_message(
                content="No more projects.",
                view=self
            )
            return

        await interaction.response.edit_message(
            content=self.format(data),
            view=self
        )


# ───────────────── COG ─────────────────

class Projects(commands.Cog):

    def __init__(self, bot):
        self.bot = bot

    @discord.app_commands.command(name="addproject", description="Add a project")
    async def addproject(self, interaction: discord.Interaction):
        await interaction.response.send_message(
            "Select a status for the project:",
            view=StatusSelectView(),
            ephemeral=True
        )

    @discord.app_commands.command(name="listprojects", description="View projects")
    async def listprojects(self, interaction: discord.Interaction):

        view = ProjectListView(API)

        await interaction.response.defer(ephemeral=True)

        data = view.fetch()

        await interaction.followup.send(
            content=view.format(data),
            view=view
        )


# ───────────────── SETUP ─────────────────

async def setup(bot: commands.Bot):
    await bot.add_cog(Projects(bot))