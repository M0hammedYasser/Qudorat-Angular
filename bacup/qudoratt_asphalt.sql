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
-- Table structure for table `asphalt`
--

DROP TABLE IF EXISTS `asphalt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asphalt` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bulk_sp_gr_comb_agg` double NOT NULL,
  `classification` varchar(255) DEFAULT NULL,
  `correction_factora` double NOT NULL,
  `correction_factorb` double NOT NULL,
  `correction_factorc` double NOT NULL,
  `correction_factord` double NOT NULL,
  `correction_factore` double NOT NULL,
  `correction_factorf` double NOT NULL,
  `flowa` double NOT NULL,
  `flowb` double NOT NULL,
  `flowc` double NOT NULL,
  `net_weight_of_flask_water` double NOT NULL,
  `net_weight_of_loose_mix` double NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `sample_by` varchar(255) DEFAULT NULL,
  `sample_date` date DEFAULT NULL,
  `sp_gravity_of_asp_bit` double NOT NULL,
  `stability24hrsd` double NOT NULL,
  `stability24hrse` double NOT NULL,
  `stability24hrsf` double NOT NULL,
  `stabilitya` double NOT NULL,
  `stabilityb` double NOT NULL,
  `stabilityc` double NOT NULL,
  `stabilityd` double NOT NULL,
  `stabilitye` double NOT NULL,
  `stabilityf` double NOT NULL,
  `test_by` varchar(255) DEFAULT NULL,
  `testing_date` date DEFAULT NULL,
  `weight_air_drya` double NOT NULL,
  `weight_air_dryb` double NOT NULL,
  `weight_air_dryc` double NOT NULL,
  `weight_air_dryd` double NOT NULL,
  `weight_air_drye` double NOT NULL,
  `weight_air_dryf` double NOT NULL,
  `weight_air_surf_drya` double NOT NULL,
  `weight_air_surf_dryb` double NOT NULL,
  `weight_air_surf_dryc` double NOT NULL,
  `weight_air_surf_dryd` double NOT NULL,
  `weight_air_surf_drye` double NOT NULL,
  `weight_air_surf_dryf` double NOT NULL,
  `weight_flask_water_sample` double NOT NULL,
  `weight_watera` double NOT NULL,
  `weight_waterb` double NOT NULL,
  `weight_waterc` double NOT NULL,
  `weight_waterd` double NOT NULL,
  `weight_watere` double NOT NULL,
  `weight_waterf` double NOT NULL,
  `bitumen_id` int DEFAULT NULL,
  `gradation_test_id` int DEFAULT NULL,
  `test_id` varchar(255) DEFAULT NULL,
  `consultant` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name_of_test` varchar(255) DEFAULT NULL,
  `owner` varchar(255) DEFAULT NULL,
  `sample_no` int NOT NULL,
  `asphalt_applier` varchar(255) DEFAULT NULL,
  `asphalt_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKspyrbg8p1sywk9n1v6yhbr8j8` (`bitumen_id`),
  UNIQUE KEY `UK5f6oaa9ctmiev951tlk2hhdxe` (`gradation_test_id`),
  KEY `FK27cnpiah58aoo2jjfhqgkc7bd` (`test_id`),
  CONSTRAINT `FK27cnpiah58aoo2jjfhqgkc7bd` FOREIGN KEY (`test_id`) REFERENCES `test` (`id`),
  CONSTRAINT `FK6c4cl46n1ajkcghox056q82ju` FOREIGN KEY (`gradation_test_id`) REFERENCES `gradation_test` (`id`),
  CONSTRAINT `FKtq6h0epujg9evavx3x047c65t` FOREIGN KEY (`bitumen_id`) REFERENCES `bitumen` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asphalt`
--

LOCK TABLES `asphalt` WRITE;
/*!40000 ALTER TABLE `asphalt` DISABLE KEYS */;
INSERT INTO `asphalt` VALUES (1,2.559,'ASTM- D6927',0.96,0.96,1,1,0.96,0.96,3,3.2,3.1,8670,2015,'Lorem Ipsum is simply dummy text of the printing standard dummy text ever since the 1500s ','IBRAHIM','2025-04-22',1.026,1690,1608,1613,2264,2083,2108,1690,1675,1680,'SALIK','2025-04-23',1200.1,1200.4,1200.5,1200.5,1200.3,1200.5,1218.1,1215.8,1219.3,1217.2,1218.1,1219.2,9840,687.8,687.5,697.8,697.8,686.6,686.3,1,1,'AM-A000001','Dr. Ahmed Ali','Cairo Site A','Concrete Strength Test','ABC Construction Co.',123,'applier 55','type');
/*!40000 ALTER TABLE `asphalt` ENABLE KEYS */;
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
