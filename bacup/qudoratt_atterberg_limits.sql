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
-- Table structure for table `atterberg_limits`
--

DROP TABLE IF EXISTS `atterberg_limits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atterberg_limits` (
  `id` int NOT NULL AUTO_INCREMENT,
  `can_number1` int NOT NULL,
  `can_number2` int NOT NULL,
  `can_number3` int NOT NULL,
  `can_number4` int NOT NULL,
  `can_number5` int NOT NULL,
  `can_number6` int NOT NULL,
  `can_number7` int NOT NULL,
  `can_number8` int NOT NULL,
  `classification` varchar(255) DEFAULT NULL,
  `consultant` varchar(255) DEFAULT NULL,
  `liquid_limit` double NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `mass_can_and_soil_dry1` double NOT NULL,
  `mass_can_and_soil_dry2` double NOT NULL,
  `mass_can_and_soil_dry3` double NOT NULL,
  `mass_can_and_soil_dry4` double NOT NULL,
  `mass_can_and_soil_dry5` double NOT NULL,
  `mass_can_and_soil_dry6` double NOT NULL,
  `mass_can_and_soil_dry7` double NOT NULL,
  `mass_can_and_soil_dry8` double NOT NULL,
  `mass_can_and_soil_wet1` double NOT NULL,
  `mass_can_and_soil_wet2` double NOT NULL,
  `mass_can_and_soil_wet3` double NOT NULL,
  `mass_can_and_soil_wet4` double NOT NULL,
  `mass_can_and_soil_wet5` double NOT NULL,
  `mass_can_and_soil_wet6` double NOT NULL,
  `mass_can_and_soil_wet7` double NOT NULL,
  `mass_can_and_soil_wet8` double NOT NULL,
  `mass_of_empty_can1` double NOT NULL,
  `mass_of_empty_can2` double NOT NULL,
  `mass_of_empty_can3` double NOT NULL,
  `mass_of_empty_can4` double NOT NULL,
  `mass_of_empty_can5` double NOT NULL,
  `mass_of_empty_can6` double NOT NULL,
  `mass_of_empty_can7` double NOT NULL,
  `mass_of_empty_can8` double NOT NULL,
  `name_of_test` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `number_of_blows5` int NOT NULL,
  `number_of_blows6` int NOT NULL,
  `number_of_blows7` int NOT NULL,
  `number_of_blows8` int NOT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `plastic_limit` double NOT NULL,
  `plasticity_index` double NOT NULL,
  `sample_by` varchar(255) DEFAULT NULL,
  `sample_date` date DEFAULT NULL,
  `sample_no` int NOT NULL,
  `test_by` varchar(255) DEFAULT NULL,
  `testing_date` date DEFAULT NULL,
  `test_id` varchar(255) DEFAULT NULL,
  `uscs` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrewm3scl1inkqkb9iklpscjxv` (`test_id`),
  CONSTRAINT `FKrewm3scl1inkqkb9iklpscjxv` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atterberg_limits`
--

LOCK TABLES `atterberg_limits` WRITE;
/*!40000 ALTER TABLE `atterberg_limits` DISABLE KEYS */;
INSERT INTO `atterberg_limits` VALUES (1,35,37,35,37,27,28,31,34,'ASTM  C39','Dr. Ahmed Ali',33,'Cairo Site A',27.9,28.53,27.9,28.53,41.19,46.05,42.98,41.54,29.26,30.03,29.26,30.03,48.61,55.53,51.71,50.51,20.63,20.66,20.63,20.66,17.33,17.41,17.45,17.36,'Concrete Strength Test','Lorem Ipsum is simply dummy text of the printing standard dummy text ever since the 1500s ',34,27,22,17,'ABC Construction Co.',19,0,'AHMED','2025-05-09',55,'SALIK','2025-05-09','AL-A000001','CLL');
/*!40000 ALTER TABLE `atterberg_limits` ENABLE KEYS */;
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
