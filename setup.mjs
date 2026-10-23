import { execSync } from 'child_process';

try {
    console.log('📦 Importando base de datos a "tilines_db"...');
    execSync('mariadb -u root -e "DROP DATABASE IF EXISTS tilines_db;"')
    execSync('mariadb -u root -e "CREATE DATABASE IF NOT EXISTS tilines_db;"')
    execSync('mariadb -u root -p tilines_db < ./init-db.sql', { stdio: 'inherit' });

    console.log('\n🚀 Instalando dependencias de Node.js...');
    execSync('npm i', { stdio: 'inherit' });

    console.log('\n✅ ¡Proceso completado con éxito!');
} catch (error) {
    console.error('\n❌ Hubo un error durante la ejecución:', error.message);
    process.exit(1);
}
