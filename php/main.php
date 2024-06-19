<?php

require_once('User.php');
require_once('UserQueries.php');
require_once('ScheduleQueries.php');

UserQueries::RegisterUser(new User(1, 62285, 'stanimir1', '<deleted>@gmail.com', "Oi9QueiP", 'ADMIN'));
UserQueries::RegisterUser(new User(2, 62249, 'eliana99', 'eliana99.sv@gmail.com', "Eliana99", 'ADMIN'));
UserQueries::RegisterUser(new User(3, 62294, 'maria88', 'mmtashkova@abv.bg', "Maria88", 'REGULAR'));
UserQueries::RegisterUser(new User(4, 62305, 'vkirilova7', 'kirilovavlr@gmail.com', "VKirilova7", 'REGULAR'));
UserQueries::RegisterUser(new User(5, 62626, 'test', 'test@gmail.com', "Test11", 'REGULAR'));
UserQueries::RegisterUser(new User(6, 62000, 'milenpetrov', 'milenp@fmi.uni-sofia.bg', "MilenW16", 'ADMIN'));

ScheduleQueries::CreateSchedule(new Schedule(1, 'Защита на проект', '2021-06-22', '09:00', '15:00', '00:20', TRUE, 1));
ScheduleQueries::CreateSchedule(new Schedule(2, 'Защита на проект', '2021-06-23', '10:00', '14:00', '00:15', TRUE, 2));
ScheduleQueries::CreateSchedule(new Schedule(3, 'Защита на проект', '2021-06-21', '11:00', '15:00', '00:10', TRUE, 6));

ScheduleQueries::AddScheduleRecord(new ScheduleRecord(3, 3, 3, 'Въведение в PHP', 'В тази презентация...', 5.75));
ScheduleQueries::AddScheduleRecord(new ScheduleRecord(3, 2, 4, 'Основни функции в JavaScript', 'В тази презентация...', 6));
ScheduleQueries::AddScheduleRecord(new ScheduleRecord(2, 1, 4, 'Заглавие 1', 'В тази презентация...', NULL));
ScheduleQueries::AddScheduleRecord(new ScheduleRecord(1, 2, 3, 'Заглавие 2', 'В тази презентация...', 4.35));
ScheduleQueries::AddScheduleRecord(new ScheduleRecord(1, 4, 4, 'Заглавие 3', 'В тази презентация...', 2));
ScheduleQueries::AddScheduleRecord(new ScheduleRecord(2, 5, 3, 'Заглавие 4', 'В тази презентация...', NULL));
ScheduleQueries::AddScheduleRecord(new ScheduleRecord(1, 1, 5, 'Заглавие 5', 'В тази презентация...', NULL));
ScheduleQueries::AddScheduleRecord(new ScheduleRecord(2, 6, 5, 'Заглавие 6', 'В тази презентация...', 3.5));

?>
