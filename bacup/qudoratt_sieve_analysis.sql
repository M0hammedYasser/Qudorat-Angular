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
-- Table structure for table `sieve_analysis`
--

DROP TABLE IF EXISTS `sieve_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sieve_analysis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mass_retaineda` double NOT NULL,
  `mass_retainedb` double NOT NULL,
  `mass_retainedc` double NOT NULL,
  `mass_retainedd` double NOT NULL,
  `mass_retainede` double NOT NULL,
  `mass_retainedf` double NOT NULL,
  `mass_retainedg` double NOT NULL,
  `mass_retainedh` double NOT NULL,
  `mass_retainedi` double NOT NULL,
  `mass_retainedj` double NOT NULL,
  `mass_retainedk` double NOT NULL,
  `mass_retainedl` double NOT NULL,
  `mass_retainedm` double NOT NULL,
  `material_type` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `sample_by` varchar(255) DEFAULT NULL,
  `sampling_date` date DEFAULT NULL,
  `test_by` varchar(255) DEFAULT NULL,
  `total_weigh` double NOT NULL,
  `test_id` varchar(255) DEFAULT NULL,
  `consultant` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name_of_test` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `sample_no` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcdfi45jhdjaoth4ok273jpgu3` (`test_id`),
  CONSTRAINT `FKcdfi45jhdjaoth4ok273jpgu3` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sieve_analysis`
--

LOCK TABLES `sieve_analysis` WRITE;
/*!40000 ALTER TABLE `sieve_analysis` DISABLE KEYS */;
INSERT INTO `sieve_analysis` VALUES (1,0,0,5,14,20,30,54,70,85,90,92,93,95,'ASTM C-136','Lorem Ipsum is simply dummy text of the printing standard dummy text ever since the 1500s ','Mohammed','2025-04-09','ahmad',100,'SO-A000001','Dr. Ahmed Ali','Cairo Site A','Concrete Strength Test','ABC Construction Co.',123),(4,0,0,5,14,20,30,54,70,85,90,92,93,95,'ASTM C-136','Lorem Ipsum is simply dummy text of the printing standard dummy text ever since the 1500s ','AHMED','2025-05-21','Muhammed',100,'SO-A000001','Dr. Ahmed Ali','Cairo Site A','Concrete Strength Test','ABC Construction Co.',55);
/*!40000 ALTER TABLE `sieve_analysis` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-02 22:56:02
