CREATE TABLE `user_groups`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `group_id` int UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_users_user_groups_1` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`id`)
);

CREATE TABLE `rubric_categories`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `rubrics`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `axes` text NOT NULL,
  `criteria` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_rubrics_rubric_categories_1` FOREIGN KEY (`category_id`) REFERENCES `rubric_categories` (`id`)
);

CREATE TABLE `departments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `created_at` datetime NULL,
  `updated_at` datetime NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `divisions`  (
  `id` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `created_at` datetime NULL,
  `updated_at` datetime NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `positions`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `level` int NOT NULL,
  `created_at` datetime NULL,
  `updated_at` datetime NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `rubric_values`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `rubric_id` int NOT NULL,
  `title` varchar(40) NOT NULL,
  `description` text NOT NULL,
  `value` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_rubric_values_rubrics_1` FOREIGN KEY (`rubric_id`) REFERENCES `rubrics` (`id`)
);

CREATE TABLE `teams`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(15) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `gender` char(1) NOT NULL,
  `linkedin` text NULL,
  `photo` text NULL,
  `department_id` int NOT NULL,
  `divisions_id` int NOT NULL,
  `position_id` int NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NULL,
  `created_by` bigint NULL,
  `updated_at` timestamp NULL,
  `updated_by` bigint NULL,
  `deleted_at` datetime NULL,
  `deleted_by` bigint NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_teams_departments_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`),
  CONSTRAINT `fk_teams_positions_1` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`),
  CONSTRAINT `fk_teams_divisions_1` FOREIGN KEY (`divisions_id`) REFERENCES `divisions` (`id`)
);

CREATE TABLE `user_teams`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `team_id` bigint NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_teams_users_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_user_teams_teams_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
);

CREATE TABLE `evaluations`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `period` year NOT NULL,
  `team_id` bigint NOT NULL,
  `notes` text DEFAULT NULL,
  `submited_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_evaluations_teams_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
);

CREATE TABLE `evaluation_rubrics`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `evaluation_id` bigint NOT NULL,
  `rubric_value_id` int NOT NULL,
  `target` text DEFAULT NULL,
  `value` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_evaluation_rubrics_evaluations_1` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluations` (`id`),
  CONSTRAINT `fk_evaluation_rubrics_rubric_values_1` FOREIGN KEY (`rubric_value_id`) REFERENCES `rubric_values` (`id`)
);



CREATE TABLE `evaluation_approvals`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `evaluation_id` bigint NOT NULL,
  `approver_order` int NOT NULL,
  `approver_id` int NOT NULL,
  `approved_date` datetime NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_evaluation_approvals_evaluations_1` FOREIGN KEY (`evaluation_id`) REFERENCES `evaluations` (`id`)
);

CREATE TABLE `evaluation_approval_required`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_id` int NOT NULL,
  `position_id` int NOT NULL,
  `order` int NOT NULL,
  `level` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_evaluation_approval_required_departments_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
);

CREATE TABLE `team_leadership`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `team_id` bigint NOT NULL,
  `leader_id` bigint NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_team_leadership_teams_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`),
  CONSTRAINT `fk_team_leadership_teams_2` FOREIGN KEY (`leader_id`) REFERENCES `teams` (`id`)
);
