-- CreateTable
CREATE TABLE `Order` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_email` VARCHAR(191) NOT NULL,
    `order_date` VARCHAR(191) NOT NULL,
    `wrapping_charges` DECIMAL(65, 30) NOT NULL,
    `decoration_charges` DECIMAL(65, 30) NOT NULL,
    `sub_total` DECIMAL(65, 30) NOT NULL,
    `discount` DECIMAL(65, 30) NOT NULL,
    `total_amount` DECIMAL(65, 30) NOT NULL,
    `paid_amount` DECIMAL(65, 30) NOT NULL,
    `balance` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDetail` (
    `order_detail_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `total` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`order_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
