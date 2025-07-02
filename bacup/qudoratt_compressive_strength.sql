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
-- Table structure for table `compressive_strength`
--

DROP TABLE IF EXISTS `compressive_strength`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compressive_strength` (
  `id` int NOT NULL AUTO_INCREMENT,
  `air_temperature` double NOT NULL,
  `cement_content` double NOT NULL,
  `classification` varchar(255) DEFAULT NULL,
  `concrete_temperature` double NOT NULL,
  `date_cast` date DEFAULT NULL,
  `diameter` double NOT NULL,
  `fracturea` int NOT NULL,
  `fractureb` int NOT NULL,
  `height` double NOT NULL,
  `loada` double NOT NULL,
  `loadb` double NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `sampleaage` int NOT NULL,
  `samplebage` int NOT NULL,
  `sample_by` varchar(255) DEFAULT NULL,
  `sample_date` date DEFAULT NULL,
  `slump` double NOT NULL,
  `spec_twinty_eight_day_strength` double NOT NULL,
  `test_by` varchar(255) DEFAULT NULL,
  `testing_date` date DEFAULT NULL,
  `weighta` double NOT NULL,
  `weightb` double NOT NULL,
  `test_id` varchar(255) DEFAULT NULL,
  `consultant` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name_of_test` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `sample_no` int NOT NULL,
  `fracturec` int NOT NULL,
  `fractured` int NOT NULL,
  `fracturee` int NOT NULL,
  `fracturef` int NOT NULL,
  `loadc` double NOT NULL,
  `loadd` double NOT NULL,
  `loade` double NOT NULL,
  `loadf` double NOT NULL,
  `samplecage` int NOT NULL,
  `sampledage` int NOT NULL,
  `sampleeage` int NOT NULL,
  `samplefage` int NOT NULL,
  `weightc` double NOT NULL,
  `weightd` double NOT NULL,
  `weighte` double NOT NULL,
  `weightf` double NOT NULL,
  `cement_content_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKls81r9myje2prjh3ir2f95t29` (`test_id`),
  CONSTRAINT `FKls81r9myje2prjh3ir2f95t29` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compressive_strength`
--

LOCK TABLES `compressive_strength` WRITE;
/*!40000 ALTER TABLE `compressive_strength` DISABLE KEYS */;
INSERT INTO `compressive_strength` VALUES (1,23.5,350,'ASTM  C39',23,'2025-04-16',15,3,0,30,500,0,'Lorem Ipsum is simply dummy text of the printing standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into  .',7,0,'AHMED','2025-04-16',85.5,350,'SALIK','2025-04-23',12700,0,'CS-A000001','John Doe Consulting','New Cairo, Egypt','Concrete','ABC Construction Co.',55,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'CPC');
/*!40000 ALTER TABLE `compressive_strength` ENABLE KEYS */;
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
