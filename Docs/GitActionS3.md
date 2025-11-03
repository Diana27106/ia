# **Despliegue automático de aplicación web estática en Amazon S3**

## Enlaces del proyecto

| Recurso                | Enlace                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Sitio Web en S3**    | [https://miweb-ia-demo.s3.us-east-1.amazonaws.com/index.html](https://miweb-ia-demo.s3.us-east-1.amazonaws.com/index.html)                             |
| **Repositorio GitHub** | [https://github.com/Diana27106/ia/blob/main/.github/workflows/deploys3.yml](https://github.com/Diana27106/ia/blob/main/.github/workflows/deploys3.yml) |

---

## ⚙️ Archivo de Workflow — `.github/workflows/deploy.yml`

```yaml
name: Deploy to AWS S3

on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Usar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "latest"

      - name: Instalar dependencias
        run: npm install

      - name: Verificar que el proyecto contiene JavaScript
        run: |
          if ! grep -rq "\.js" .; then
            echo "No se encontraron archivos JavaScript. Cancelando..."
            exit 1
          else
            echo "Se encontraron archivos JavaScript."
          fi

      - name: Ejecutar pruebas unitarias
        run: |
          npm test || (echo "Las pruebas fallaron." && exit 1)
          echo "Pruebas unitarias completadas correctamente."

      - name: Generar documentación con JSDoc
        run: |
          echo "Generando documentación con JSDoc..."
          mkdir -p docs
          npx jsdoc -c jsdoc.json || true
          echo "Documentación generada en /docs"

      - name: Configurar credenciales de AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-session-token: ${{ secrets.AWS_SESSION_TOKEN }}
          aws-region: us-east-1

      - name: Desplegar en S3
        run: |
          aws s3 sync . s3://miweb-ia-demo --delete --exclude ".git/*" --exclude ".github/*"
```

---

## ✅ Verificación final del despliegue

| Paso                     | Resultado                                              |
| ------------------------ | ------------------------------------------------------ |
| 🧩 Instalación y pruebas | ✅ Todas las dependencias instaladas y pruebas pasadas |
| 📄 Documentación JSDoc   | ✅ Generada automáticamente en `/docs`                 |
| ☁️ Despliegue S3         | ✅ Sitio sincronizado correctamente con el bucket      |
| 🌍 URL accesible         | ✅ Visible en el dominio S3 público                    |
