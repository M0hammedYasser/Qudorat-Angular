-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: qudoratt
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `id` varchar(255) NOT NULL,
  `activist` varchar(255) DEFAULT NULL,
  `adopter` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) NOT NULL,
  `date` date NOT NULL,
  `is_active` bit(1) NOT NULL,
  `is_adopt` bit(1) NOT NULL,
  `is_paid` bit(1) NOT NULL,
  `price` float NOT NULL,
  `project_id` varchar(255) DEFAULT NULL,
  `test_manager_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKael9sac0jyge72osrwuou49i1` (`project_id`),
  KEY `FKq69m6b6pmwbq2135p1jfxdrvi` (`test_manager_id`),
  CONSTRAINT `FKael9sac0jyge72osrwuou49i1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`),
  CONSTRAINT `FKq69m6b6pmwbq2135p1jfxdrvi` FOREIGN KEY (`test_manager_id`) REFERENCES `test_manager` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES ('AL-A000001','Muhammed Yasser','Muhammed Yasser','2025-05-17 14:32:58.073501','2025-05-17',_binary '',_binary '',_binary '',500,'P20250408001',4),('AM-A000001','Muhammed Yasser','admin','2025-05-17 14:33:14.180585','2025-05-17',_binary '',_binary '',_binary '',300,'P20250408001',2),('CS-A000001','Muhammed Yasser','admin','2025-06-08 00:16:24.555728','2025-05-17',_binary '',_binary '',_binary '',200,'P20250408001',3),('MDR-A000001','Muhammed Yasser','Muhammed Yasser','2025-06-08 00:15:45.128264','2025-06-02',_binary '',_binary '',_binary '',200,'P20250408001',5),('SO-A000001','admin','admin','2025-05-17 14:32:49.970844','2025-05-17',_binary '',_binary '',_binary '',600,'P20250408001',1),('SO-A000002','Muhammed Yasser','Muhammed Yasser','2025-07-01 21:15:45.635250','2025-06-09',_binary '',_binary '',_binary '',100,'P20250408001',1);
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-02 22:56:03
