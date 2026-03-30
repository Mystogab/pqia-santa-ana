const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configuración de rutas
const paths = {
  source: './content/info',
  template: './public/sub.html',
  output: './public'
};

/**
 * Función principal de build
 */
function build() {
  console.log('🚀 Iniciando build...');

  // 1. Asegurar que la carpeta de salida exista
  if (!fs.existsSync(paths.output)) {
    fs.mkdirSync(paths.output, { recursive: true });
  }

  // 2. Leer el template una sola vez (más eficiente)
  const template = fs.readFileSync(paths.template, 'utf8');

  // 3. Obtener todos los archivos .md del directorio
  const files = fs.readdirSync(paths.source)
    .filter(file => file.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(paths.source, file);
    const fileName = path.parse(file).name; // 'nombre-archivo' sin el .md

    try {
      // 4. Leer y convertir Markdown
      const mdContent = fs.readFileSync(filePath, 'utf8');
      const htmlBody = marked.parse(mdContent);

      // 5. Inyectar en el template
      const finalHtml = template
        .replace(/{{title}}/g, fileName.replace(fileName.at(0), fileName.at(0).toUpperCase()).replaceAll('-', ' '))
        .replace(/{{content}}/g, htmlBody);

      // 6. Guardar el archivo
      const outputPath = path.join(paths.output, `${fileName}.html`);
      fs.writeFileSync(outputPath, finalHtml);

      console.log(`✅ Generado: ${fileName}.html`);
    } catch (err) {
      console.error(`❌ Error procesando ${file}:`, err);
    }
  });

  console.log('✨ Build completado con éxito.');
}

build();
