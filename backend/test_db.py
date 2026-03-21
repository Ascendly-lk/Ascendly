import asyncio
from dotenv import load_dotenv
load_dotenv()
from app.api.endpoints.patent_firm import get_dashboard_stats, get_urgent_actions, get_dashboard_pipeline, get_activities
from dotenv import load_dotenv
async def test():
    with open("test_out3.txt", "w", encoding="utf-8") as f:
        f.write("--- Testing Stats ---\n")
        try:
            stats = await get_dashboard_stats()
            f.write(str(stats) + "\n")
        except Exception as e:
            f.write("Stats Error: " + str(e) + "\n")

        f.write("--- Testing Urgent ---\n")
        try:
            urg = await get_urgent_actions()
            f.write(str(urg) + "\n")
        except Exception as e:
            f.write("Urgent Error: " + str(e) + "\n")

        f.write("--- Testing Pipeline ---\n")
        try:
            pipe = await get_dashboard_pipeline()
            f.write(str(pipe) + "\n")
        except Exception as e:
            f.write("Pipeline Error: " + str(e) + "\n")

        f.write("--- Testing Activities ---\n")
        try:
            act = await get_activities()
            f.write(str(act) + "\n")
        except Exception as e:
            f.write("Activities Error: " + str(e) + "\n")

if __name__ == '__main__':
    asyncio.run(test())
