-- CreateTable
CREATE TABLE "public"."clientes" (
    "id_client" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "cc" INTEGER,
    "telefono" INTEGER,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "public"."pedidos" (
    "id_orders" SERIAL NOT NULL,
    "producto" VARCHAR(100) NOT NULL,
    "catidad" INTEGER,
    "valor_u" DECIMAL(10,2),
    "total" DECIMAL(10,2),

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id_orders")
);

-- CreateTable
CREATE TABLE "public"."productos" (
    "id_product" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "stock" INTEGER,
    "valor" DECIMAL(10,2),

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id_product")
);

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id_user" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "puesto" VARCHAR(50),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_user")
);
