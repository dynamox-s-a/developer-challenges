from fastapi import fastAPI 

app = fastAPI(tile="Dynamox Signal Processeng API")

@app.get("/")
async def root():
    return {
        "status": "Online",
        "message": "Dynomox API is running successfully!"
    }
@app.get("/health")
async def health_check():
    return {"status": "healfhy"}