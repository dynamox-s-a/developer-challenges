import os
import subprocess
import sys

def run_command(command, description):
    print(f"\n--- {description} ---")
    try:
        # Executa o comando e mostra o output no terminal em tempo real
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error during: {description}")
        sys.exit(1)

def main():
    # 1. Nome da imagem
    image_name = "dynamox-api"

    print("🚀 Starting Dynamox API Automation Script")

    # 2. Parar containers antigos para não dar conflito de porta
    run_command(f"docker ps -q --filter ancestor={image_name} | xargs -r docker stop", "Stopping old containers")

    # 3. Buildar a imagem
    run_command(f"docker build -t {image_name} .", "Building Docker image")

    # 4. Rodar os testes antes de subir (Garantia de Qualidade)
    run_command(f"docker run {image_name} pytest", "Running Automated Tests")

    # 5. Se os testes passaram, rodar a aplicação
    print(f"\n✅ Tests passed! Starting API on http://localhost:8000")
    run_command(f"docker run -p 8000:8000 {image_name}", "Starting API")

if __name__ == "__main__":
    main()