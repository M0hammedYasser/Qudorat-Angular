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
-- Table structure for table `moisture_density_relationship`
--

DROP TABLE IF EXISTS `moisture_density_relationship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `moisture_density_relationship` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dry_wt_soil_conta` double NOT NULL,
  `dry_wt_soil_contb` double NOT NULL,
  `dry_wt_soil_contc` double NOT NULL,
  `dry_wt_soil_contd` double NOT NULL,
  `dry_wt_soil_conte` double NOT NULL,
  `no_blows` double NOT NULL,
  `no_of_layers` int NOT NULL,
  `vol_of_mould` double NOT NULL,
  `wet_wt_soil_conta` double NOT NULL,
  `wet_wt_soil_contb` double NOT NULL,
  `wet_wt_soil_contc` double NOT NULL,
  `wet_wt_soil_contd` double NOT NULL,
  `wet_wt_soil_conte` double NOT NULL,
  `wet_wt_soil_moulda` int NOT NULL,
  `wet_wt_soil_mouldb` int NOT NULL,
  `wet_wt_soil_mouldc` int NOT NULL,
  `wet_wt_soil_mouldd` int NOT NULL,
  `wet_wt_soil_moulde` int NOT NULL,
  `wt_of_containera` double NOT NULL,
  `wt_of_containerb` double NOT NULL,
  `wt_of_containerc` double NOT NULL,
  `wt_of_containerd` double NOT NULL,
  `wt_of_containere` double NOT NULL,
  `wt_of_mould` double NOT NULL,
  `wt_of_rammer` double NOT NULL,
  `classification` varchar(255) DEFAULT NULL,
  `consultant` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name_of_test` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `sample_by` varchar(255) DEFAULT NULL,
  `sample_date` date DEFAULT NULL,
  `sample_no` int NOT NULL,
  `test_by` varchar(255) DEFAULT NULL,
  `testing_date` date DEFAULT NULL,
  `test_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKaqxo6rbm0fy1lm99chtt0cn5b` (`test_id`),
  CONSTRAINT `FKaqxo6rbm0fy1lm99chtt0cn5b` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moisture_density_relationship`
--

LOCK TABLES `moisture_density_relationship` WRITE;
/*!40000 ALTER TABLE `moisture_density_relationship` DISABLE KEYS */;
INSERT INTO `moisture_density_relationship` VALUES (1,358.7,364.1,341.6,351.1,354,56,5,2124,367.5,378.5,363.3,379.5,385,10989,11224,11576,11537,11500,17.7,17.6,19.1,19.4,20,6460,5.54,'ASTM  C39','Dr. Ahmed Ali','Cairo Site A','Concrete Strength Test','Lorem Ipsum is simply dummy text of the printing standard dummy text ever since the 1500s ','ABC Construction Co.','AHMED','2025-06-02',55,'SALIK','2025-06-02','MDR-A000001');
/*!40000 ALTER TABLE `moisture_density_relationship` ENABLE KEYS */;
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
