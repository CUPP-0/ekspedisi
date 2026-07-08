-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 08 Jul 2026 pada 06.37
-- Versi server: 8.0.30
-- Versi PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ekspedisi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `branches`
--

CREATE TABLE `branches` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `branches`
--

INSERT INTO `branches` (`id`, `name`, `city`, `address`, `phone`, `created_at`, `updated_at`) VALUES
(1, 'Cirebon hub', 'cirebon', 'Jln siliwangii', '083833944848', '2026-07-02 15:07:39', '2026-07-02 15:10:29'),
(2, 'Bekasi-Hub-cab1', 'Bekasi', 'Mall Sumarecon', '083833944849', '2026-07-02 23:23:21', '2026-07-02 23:23:21'),
(3, 'Bandung', 'Bandung', 'Ciamis', '083833944847', '2026-07-03 09:13:45', '2026-07-03 09:13:45');

-- --------------------------------------------------------

--
-- Struktur dari tabel `courier_applications`
--

CREATE TABLE `courier_applications` (
  `id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `approved_by` bigint UNSIGNED DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `courier_applications`
--

INSERT INTO `courier_applications` (`id`, `branch_id`, `name`, `email`, `phone`, `password`, `address`, `status`, `approved_by`, `approved_at`, `rejection_reason`, `created_at`, `updated_at`) VALUES
(1, 2, 'Nur Yusuf Ferdiansyah', 'yusuff@gmail.com', '083833944840', '$2b$10$7lXoStg7r2MLiYrnkLcYS.TDq9mqGbynkfwNHcFts2PaCpTa6k2OW', 'Cirebon', 'approved', 3, '2026-07-04 08:12:43', NULL, '2026-07-04 07:54:04', '2026-07-04 08:12:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `customers`
--

CREATE TABLE `customers` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `address` text,
  `city` varchar(255) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `email_verified_at`, `password`, `address`, `city`, `phone`, `photo`, `created_at`, `updated_at`) VALUES
(1, 'Nur Yusuf Ferdiansyah', 'yusufftibazma@gmail.com', NULL, '$2b$10$6mkBbC/BtfdevDM4B2l4eeb92BABTTz.LWuNaQma6h4XfP7qRirgi', 'Crebon o=', 'Cirebon', '083833944848', NULL, '2026-07-02 15:51:44', '2026-07-02 15:51:44');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL,
  `shipment_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `snap_token` varchar(255) DEFAULT NULL,
  `order_id` varchar(100) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `shipment_id`, `amount`, `snap_token`, `order_id`, `transaction_id`, `payment_method`, `payment_status`, `paid_at`, `payment_date`, `created_at`, `updated_at`) VALUES
(47, 33, '10000.00', '501a76cc-2b17-4c5e-a250-8af21915048a', NULL, NULL, NULL, 'pending', NULL, '2026-07-08', '2026-07-07 17:53:50', '2026-07-07 17:54:19'),
(48, 34, '20000.00', 'd0872e34-6d57-4f9e-bb6c-737c0edf9230', 'EXP-35-1783447067353', 'A120260707175753c66VtgjYvdID', 'bank_transfer', 'paid', NULL, '2026-07-08', '2026-07-07 17:56:28', '2026-07-07 17:58:07'),
(49, 35, '30000.00', 'a8bb2bab-0bc2-4e09-a19f-4477c749a316', 'EXP-35-1783447067353', 'A120260707175753c66VtgjYvdID', 'bank_transfer', 'paid', NULL, '2026-07-08', '2026-07-07 17:57:47', '2026-07-07 17:58:07'),
(50, 36, '40000.00', '9d53c2ce-b7e6-4967-a11a-69a97869f609', 'EXP-36-1783448133175', 'A1202607071815421JUjO54BmZID', 'bank_transfer', 'paid', NULL, '2026-07-08', '2026-07-07 18:15:33', '2026-07-07 18:15:58'),
(51, 37, '40000.00', '3f986a46-c331-4b98-a0ab-4e0d35b5ca4f', 'EXP-37-1783472390645', 'A120260708005957qqn1kca99SID', 'bank_transfer', 'paid', NULL, '2026-07-08', '2026-07-08 00:59:51', '2026-07-08 01:00:16');

-- --------------------------------------------------------

--
-- Struktur dari tabel `rates`
--

CREATE TABLE `rates` (
  `id` bigint UNSIGNED NOT NULL,
  `origin_city` varchar(255) NOT NULL,
  `destination_city` varchar(255) NOT NULL,
  `price_per_kg` decimal(15,2) NOT NULL,
  `estimated_days` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `rates`
--

INSERT INTO `rates` (`id`, `origin_city`, `destination_city`, `price_per_kg`, `estimated_days`, `created_at`, `updated_at`) VALUES
(1, 'cirebon', 'Bekasi', '10000.00', 3, '2026-07-02 23:24:25', '2026-07-02 23:24:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `shipments`
--

CREATE TABLE `shipments` (
  `id` bigint UNSIGNED NOT NULL,
  `tracking_number` varchar(255) NOT NULL,
  `sender_id` bigint UNSIGNED NOT NULL,
  `receiver_id` bigint UNSIGNED NOT NULL,
  `origin_branch_id` bigint UNSIGNED NOT NULL,
  `destination_branch_id` bigint UNSIGNED NOT NULL,
  `courier_id` bigint UNSIGNED DEFAULT NULL,
  `rate_id` bigint UNSIGNED DEFAULT NULL,
  `total_weight` decimal(10,2) NOT NULL,
  `total_price` decimal(15,2) NOT NULL,
  `status` enum('pending','picked_up','in_transit','arrived_at_branch','out_for_delivery','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `shipment_date` date NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `shipments`
--

INSERT INTO `shipments` (`id`, `tracking_number`, `sender_id`, `receiver_id`, `origin_branch_id`, `destination_branch_id`, `courier_id`, `rate_id`, `total_weight`, `total_price`, `status`, `shipment_date`, `photo`, `created_at`, `updated_at`) VALUES
(33, 'EXP260708005348', 1, 1, 1, 2, NULL, 1, '1.00', '10000.00', 'pending', '2026-07-08', NULL, '2026-07-07 17:53:48', '2026-07-07 17:53:48'),
(34, 'EXP260708005624', 1, 1, 1, 2, NULL, 1, '2.00', '20000.00', 'pending', '2026-07-08', NULL, '2026-07-07 17:56:24', '2026-07-07 17:56:24'),
(35, 'EXP260708005742', 1, 1, 1, 2, 5, 1, '3.00', '30000.00', 'in_transit', '2026-07-08', NULL, '2026-07-07 17:57:42', '2026-07-07 18:13:28'),
(36, 'EXP260708011529', 1, 1, 1, 2, NULL, 1, '4.00', '40000.00', 'pending', '2026-07-08', NULL, '2026-07-07 18:15:29', '2026-07-07 18:15:29'),
(37, 'EXP260708075941', 1, 1, 1, 2, NULL, 1, '4.00', '40000.00', 'pending', '2026-07-08', NULL, '2026-07-08 00:59:41', '2026-07-08 00:59:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `shipment_items`
--

CREATE TABLE `shipment_items` (
  `id` bigint UNSIGNED NOT NULL,
  `shipment_id` bigint UNSIGNED NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `weight` decimal(10,2) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `shipment_items`
--

INSERT INTO `shipment_items` (`id`, `shipment_id`, `item_name`, `quantity`, `weight`, `photo`, `created_at`, `updated_at`) VALUES
(32, 33, 'ucup', 1, '1.00', NULL, '2026-07-07 17:53:48', '2026-07-07 17:53:48'),
(33, 34, 'Ucup', 2, '1.00', NULL, '2026-07-07 17:56:24', '2026-07-07 17:56:24'),
(34, 35, 'Ucup', 3, '1.00', NULL, '2026-07-07 17:57:42', '2026-07-07 17:57:42'),
(35, 36, 'Nur', 4, '1.00', NULL, '2026-07-07 18:15:29', '2026-07-07 18:15:29'),
(36, 37, 'Sepatu', 4, '1.00', NULL, '2026-07-08 00:59:41', '2026-07-08 00:59:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `shipment_trackings`
--

CREATE TABLE `shipment_trackings` (
  `id` bigint UNSIGNED NOT NULL,
  `shipment_id` bigint UNSIGNED NOT NULL,
  `location` varchar(255) NOT NULL,
  `description` text,
  `status` enum('assigned','picked_up','in_transit','arrived_at_branch','out_for_delivery','delivered') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `tracked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `shipment_trackings`
--

INSERT INTO `shipment_trackings` (`id`, `shipment_id`, `location`, `description`, `status`, `tracked_at`, `created_at`, `updated_at`) VALUES
(5, 35, 'Cabang', 'Kurir telah ditugaskan oleh admin.', 'picked_up', '2026-07-07 18:11:57', '2026-07-07 18:11:57', '2026-07-07 18:11:57'),
(6, 35, 'Cirebon', 'PP', 'in_transit', '2026-07-07 18:13:28', '2026-07-07 18:13:28', '2026-07-07 18:13:28');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','cashier','courier','manager') NOT NULL,
  `branch_id` bigint UNSIGNED DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `role`, `branch_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin@ekspedisi.com', NULL, NULL, '$2b$10$GuUVx2nLUqcAxN.h9pD1wehGnYtVZlkM9sP2IcPLHle91BzYViGuS', 'manager', NULL, NULL, '2026-07-02 15:06:21', '2026-07-02 15:06:21'),
(2, 'Cirebon-hub', 'yusufftibazma@gmail.com', NULL, NULL, '$2b$10$dtRScFg7oYi8XahFIHOr6ely2IuCMteL/gQ8oZiLxM8oOO3.E5wDW', 'admin', 1, NULL, '2026-07-02 15:17:53', '2026-07-02 15:17:53'),
(3, 'Bekasi-Hub-Cab1', 'bekasi@ekspedisi.com', NULL, NULL, '$2b$10$Yt0jnXW.2RGGdczbBc4i9urzBj5vqIyfaCMts8/Wg0zrIJDLPuVxO', 'admin', 2, NULL, '2026-07-02 23:23:50', '2026-07-02 23:23:50'),
(4, 'Bandung-hub', 'bandung@ekspedisi.com', NULL, NULL, '$2b$10$80dxHXLaZQlWGQ.MzMSExuf655uasEoJXlWRS4gdBWxRB99gHrnPG', 'admin', 3, NULL, '2026-07-03 09:14:11', '2026-07-03 09:14:11'),
(5, 'Nur Yusuf Ferdiansyah', 'yusuff@gmail.com', NULL, NULL, '$2b$10$7lXoStg7r2MLiYrnkLcYS.TDq9mqGbynkfwNHcFts2PaCpTa6k2OW', 'courier', 2, NULL, '2026-07-04 08:12:43', '2026-07-04 08:12:43');

-- --------------------------------------------------------

--
-- Struktur dari tabel `vehicles`
--

CREATE TABLE `vehicles` (
  `id` bigint UNSIGNED NOT NULL,
  `plate_number` varchar(255) NOT NULL,
  `type` enum('motor','mobil','truck') NOT NULL,
  `courier_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `courier_applications`
--
ALTER TABLE `courier_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indeks untuk tabel `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shipment_id` (`shipment_id`);

--
-- Indeks untuk tabel `rates`
--
ALTER TABLE `rates`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `shipments`
--
ALTER TABLE `shipments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tracking_number` (`tracking_number`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`),
  ADD KEY `origin_branch_id` (`origin_branch_id`),
  ADD KEY `destination_branch_id` (`destination_branch_id`),
  ADD KEY `courier_id` (`courier_id`),
  ADD KEY `rate_id` (`rate_id`);

--
-- Indeks untuk tabel `shipment_items`
--
ALTER TABLE `shipment_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shipment_id` (`shipment_id`);

--
-- Indeks untuk tabel `shipment_trackings`
--
ALTER TABLE `shipment_trackings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shipment_id` (`shipment_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `branch_id` (`branch_id`);

--
-- Indeks untuk tabel `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courier_id` (`courier_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `courier_applications`
--
ALTER TABLE `courier_applications`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT untuk tabel `rates`
--
ALTER TABLE `rates`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `shipments`
--
ALTER TABLE `shipments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT untuk tabel `shipment_items`
--
ALTER TABLE `shipment_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT untuk tabel `shipment_trackings`
--
ALTER TABLE `shipment_trackings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `courier_applications`
--
ALTER TABLE `courier_applications`
  ADD CONSTRAINT `courier_applications_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`);

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `shipments`
--
ALTER TABLE `shipments`
  ADD CONSTRAINT `shipments_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `shipments_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `shipments_ibfk_3` FOREIGN KEY (`origin_branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `shipments_ibfk_4` FOREIGN KEY (`destination_branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `shipments_ibfk_5` FOREIGN KEY (`courier_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `shipments_ibfk_6` FOREIGN KEY (`rate_id`) REFERENCES `rates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `shipment_items`
--
ALTER TABLE `shipment_items`
  ADD CONSTRAINT `shipment_items_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `shipment_trackings`
--
ALTER TABLE `shipment_trackings`
  ADD CONSTRAINT `shipment_trackings_ibfk_1` FOREIGN KEY (`shipment_id`) REFERENCES `shipments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`courier_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
