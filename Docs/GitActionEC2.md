# **Despliegue automático de aplicación web en EC2 con Nginx**

## 🌐 Enlaces del proyecto

| Recurso                      | Enlace                                                                                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sitio Web en EC2 (Nginx)** | [http://54.198.173.229/#introduccion](http://54.198.173.229/#introduccion) \_\_                                                                          |
| **Repositorio GitHub**       | [https://github.com/Diana27106/ia/blob/main/.github/workflows/deployec2.yml](https://github.com/Diana27106/ia/blob/main/.github/workflows/deployec2.yml) |

---

## ⚙️ Archivo de Workflow — `.github/workflows/deploy.yml`

```yaml
name: Deploy static site to EC2

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

      - name: Preparar clave SSH
        run: |
          echo "${{ secrets.EC2_KEY }}" > private_key.pem
          chmod 600 private_key.pem

      - name: Subir archivos al servidor EC2
        run: |
          echo "🚀 Subiendo archivos al servidor EC2..."
          scp -i private_key.pem -r -o StrictHostKeyChecking=no index.html css js \
          ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }}:/home/${{ secrets.EC2_USER }}/

      - name: Mover archivos a /var/www/html
        run: |
          echo "📦 Moviendo archivos al directorio de Nginx..."
          ssh -i private_key.pem -o StrictHostKeyChecking=no ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} "\
            sudo mv /home/${{ secrets.EC2_USER }}/index.html /var/www/html/ && \
            sudo rm -rf /var/www/html/css /var/www/html/js && \
            sudo mv /home/${{ secrets.EC2_USER }}/css /home/${{ secrets.EC2_USER }}/js /var/www/html/"
```

---

## **Configuración del servidor EC2**

### User Data (al lanzar la instancia)

He usado lo siguiente para para instalar **Nginx** automáticamente:

```bash
#!/bin/bash
sudo apt update -y
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
echo "<h1>Servidor EC2 en funcionamiento 🚀</h1>" | sudo tee /var/www/html/index.html
```

### ⚙️ Configuración del Security Group

- **Puerto 22 (SSH)** → acceso desde GitHub Actions
- **Puerto 80 (HTTP)** → acceso público a la web

---

## ✅ Verificación final

| Paso                      | Resultado                                 |
| ------------------------- | ----------------------------------------- |
| 🔍 Código validado        | ✅                                        |
| 🧪 Pruebas unitarias      | ✅ Superadas                              |
| 📘 Documentación generada | ✅ En `/docs`                             |
| ☁️ Archivos transferidos  | ✅ Copiados por SSH a EC2                 |
| 🌐 Sitio activo           | ✅ Accesible vía `http://<EC2_PUBLIC_IP>` |

---

## 🗂️ Estructura recomendada del repositorio

```
web-ec2-deploy/
├── src/
│   └── app.js
├── css/
│   └── style.css
├── js/
│   └── main.js
├── index.html
├── tests/
│   └── app.test.js
├── docs/
├── jsdoc.json
├── package.json
└── .github/
    └── workflows/
        └── deploy.yml
```
