SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `pizzeria` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `pizzeria`;

CREATE TABLE `detalle_pedidos` (
  `id_detalle` int NOT NULL,
  `pedido_id` int NOT NULL,
  `tamano` varchar(50) NOT NULL,
  `ingredientes` varchar(50) NOT NULL,
  `num_pizza` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `detalle_pedidos` (`id_detalle`, `pedido_id`, `tamano`, `ingredientes`, `num_pizza`, `subtotal`) VALUES
(13, 5, 'Grande', 'queso', 1, 160.00),
(14, 5, 'Mediana', 'champiñones', 1, 120.00);

CREATE TABLE `pedidos` (
  `pedido_id` int NOT NULL,
  `nombre_cliente` varchar(50) NOT NULL,
  `direccion` varchar(60) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `fecha_pedido` datetime NOT NULL,
  `total_pedido` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `pedidos` (`pedido_id`, `nombre_cliente`, `direccion`, `telefono`, `fecha_pedido`, `total_pedido`) VALUES
(5, 'rocio luna', 'Mateo de Prado 106', '4774451942', '2026-11-08 01:14:36', 280.00);


ALTER TABLE `detalle_pedidos`
  ADD PRIMARY KEY (`id_detalle`);

ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`pedido_id`);


ALTER TABLE `detalle_pedidos`
  MODIFY `id_detalle` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

ALTER TABLE `pedidos`
  MODIFY `pedido_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
