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
-- Table structure for table `gradation_test`
--

DROP TABLE IF EXISTS `gradation_test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gradation_test` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cvc_maxa` double NOT NULL,
  `cvc_maxb` double NOT NULL,
  `cvc_maxc` double NOT NULL,
  `cvc_maxd` double NOT NULL,
  `cvc_maxe` double NOT NULL,
  `cvc_maxf` double NOT NULL,
  `cvc_maxg` double NOT NULL,
  `cvc_maxh` double NOT NULL,
  `cvc_maxi` double NOT NULL,
  `cvc_maxj` double NOT NULL,
  `cvc_mina` double NOT NULL,
  `cvc_minb` double NOT NULL,
  `cvc_minc` double NOT NULL,
  `cvc_mind` double NOT NULL,
  `cvc_mine` double NOT NULL,
  `cvc_minf` double NOT NULL,
  `cvc_ming` double NOT NULL,
  `cvc_minh` double NOT NULL,
  `cvc_mini` double NOT NULL,
  `cvc_minj` double NOT NULL,
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
  `total_weigh` double NOT NULL,
  `gcvc_maxa` double NOT NULL,
  `gcvc_maxb` double NOT NULL,
  `gcvc_maxc` double NOT NULL,
  `gcvc_maxd` double NOT NULL,
  `gcvc_maxe` double NOT NULL,
  `gcvc_maxf` double NOT NULL,
  `gcvc_maxg` double NOT NULL,
  `gcvc_maxh` double NOT NULL,
  `gcvc_maxi` double NOT NULL,
  `gcvc_maxj` double NOT NULL,
  `gcvc_mina` double NOT NULL,
  `gcvc_minb` double NOT NULL,
  `gcvc_minc` double NOT NULL,
  `gcvc_mind` double NOT NULL,
  `gcvc_mine` double NOT NULL,
  `gcvc_minf` double NOT NULL,
  `gcvc_ming` double NOT NULL,
  `gcvc_minh` double NOT NULL,
  `gcvc_mini` double NOT NULL,
  `gcvc_minj` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gradation_test`
--

LOCK TABLES `gradation_test` WRITE;
/*!40000 ALTER TABLE `gradation_test` DISABLE KEYS */;
INSERT INTO `gradation_test` VALUES (1,100,100,100,90,75,52,36,17,10,5.7,100,100,100,80,65,42,28,11,6,2.7,0,0,0,3.2,10.5,52.8,67.5,84.9,92.8,96.5,1979.5,100,100,100,80,75,52,36,17,10,5.7,100,100,100,80,65,42,28,11,6,2.7);
/*!40000 ALTER TABLE `gradation_test` ENABLE KEYS */;
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
