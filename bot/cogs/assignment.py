import discord
from discord.ext import commands
import httpx
import os
from dotenv import load_dotenv

load_dotenv()
API = os.getenv("API_BASE")


# ───────────── SELECTS ─────────────

class PersonSelect(discord.ui.Select):
    def __init__(self, persons: list):
        options = [
            discord.SelectOption(label=p["name"], value=str(p["id"]))
            for p in persons[:25]
        ]
        super().__init__(placeholder="Select a person…", min_values=1, max_values=1, options=options)

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)

        person_id = int(self.values[0])

        async with httpx.AsyncClient() as client:
            r = await client.get(f"{API}/projects/", params={"limit": 20})
            r.raise_for_status()
            projects = r.json()

        if not projects:
            await interaction.edit_original_response(content="No projects found.", view=None)
            return

        await interaction.edit_original_response(
            content="Select a project:",
            view=ProjectSelectView(person_id, projects)
        )


class ProjectSelect(discord.ui.Select):
    def __init__(self, person_id: int, projects: list):
        self.person_id = person_id
        options = [
            discord.SelectOption(label=p["name"], value=str(p["id"]))
            for p in projects[:25]
        ]
        super().__init__(placeholder="Select a project…", min_values=1, max_values=1, options=options)

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)

        project_id = int(self.values[0])

        async with httpx.AsyncClient() as client:
            r = await client.post(
                f"{API}/projects/{project_id}/members",
                json={"person_id": self.person_id}
            )

        if r.status_code in (200, 201):
            msg = "✅ Member assigned successfully."
        elif r.status_code == 400:
            msg = f"⚠️ {r.json().get('detail', 'Bad request.')}"
        elif r.status_code == 404:
            msg = f"❌ {r.json().get('detail', 'Not found.')}"
        else:
            msg = f"❌ Unexpected error ({r.status_code}): {r.text}"

        await interaction.edit_original_response(content=msg, view=None)


# ───────────── VIEWS ─────────────

class PersonSelectView(discord.ui.View):
    def __init__(self, persons: list):
        super().__init__(timeout=60)
        self.add_item(PersonSelect(persons))


class ProjectSelectView(discord.ui.View):
    def __init__(self, person_id: int, projects: list):
        super().__init__(timeout=60)
        self.add_item(ProjectSelect(person_id, projects))


# ───────────── COG ─────────────

class Assignment(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @discord.app_commands.command(name="assignproject", description="Assign a project to a person")
    async def assignproject(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)

        async with httpx.AsyncClient() as client:
            try:
                r = await client.get(f"{API}/persons/", params={"limit": 20})
                r.raise_for_status()
                persons = r.json()
            except Exception as e:
                await interaction.edit_original_response(content=f"❌ Could not fetch persons: {e}")
                return

        if not persons:
            await interaction.edit_original_response(content="No persons found.")
            return

        await interaction.edit_original_response(
            content="Select a person:",
            view=PersonSelectView(persons)
        )


# ───────────── SETUP ─────────────

async def setup(bot: commands.Bot):
    await bot.add_cog(Assignment(bot))