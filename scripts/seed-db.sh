#!/bin/bash

echo "Sembrando base de datos con datos de prueba..."

# Crear usuario administrador
docker-compose exec -T api node -e "
const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function seed() {
  const client = new Client({
    host: 'postgres',
    port: 5432,
    user: 'codium',
    password: 'codium_password',
    database: 'codium_db'
  });

  await client.connect();

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await client.query(\`
    INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'admin@codium.com',
      '\${hashedPassword}',
      'Admin',
      'Codium',
      'ADMIN',
      NOW(),
      NOW()
    )
    ON CONFLICT (email) DO NOTHING;
  \`);

  console.log('Usuario admin creado: admin@codium.com / admin123');

  await client.end();
}

seed().catch(console.error);
"

echo "Base de datos sembrada correctamente!"
