<?php

require_once('Schedule.php');
require_once('ScheduleRecord.php');
require_once('RequestHandler.php');

class ScheduleQueries
{
	public static function CreateSchedule(Schedule $schedule, ?PDO $connection = null): ?int
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$statement = $connection->prepare("INSERT INTO `schedules` (id, title, date, schedule_start, schedule_end, schedule_step, is_active, created_by) " .
										  "VALUES (:id, :title, :date, :schedule_start, :schedule_end, :schedule_step, :is_active, :created_by)");
		return $statement->execute($schedule->jsonSerialize()) ? $connection->lastInsertId('id') : null;
	}
	public static function GetAllSchedules(?PDO $connection = null): array
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$result = [];
		$statement = $connection->prepare("SELECT * FROM `schedules`");
		$statement->execute();
		$i = 0;
		while($row = $statement->fetch())
			$result[$i++] = $row;
		return $result;
	}
	public static function GetScheduleById(int $id, ?PDO $connection = null): array
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$statement = $connection->prepare("SELECT * FROM `schedules` WHERE id = :id");
		$statement->execute(['id' => $id]);
		return $statement->fetch();
	}
	public static function GetScheduleRecordByKey(int $schedule_id, int $slot_number, ?PDO $connection = null): array
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$statement = $connection->prepare("SELECT * FROM `schedule_records` WHERE schedule_id = :schedule_id AND slot_number = :slot_number");
		$statement->execute(['schedule_id' => $schedule_id, 'slot_number' => $slot_number]);
		return $statement->fetch();
	}
	public static function GetScheduleRecords(int $schedule_id, ?PDO $connection = null): array
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$result = [];
		$statement = $connection->prepare("SELECT * FROM `schedule_records` WHERE schedule_id = :schedule_id ORDER BY slot_number");
		$statement->execute(['schedule_id' => $schedule_id]);
		$i = 0;
		while($row = $statement->fetch())
			$result[$i++] = $row;
		return $result;
	}
	public static function AddScheduleRecord(ScheduleRecord $sr, ?PDO $connection = null): bool
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$statement = $connection->prepare("INSERT INTO `schedule_records` (schedule_id, slot_number, presenter_id, presentation_title, keywords, grade) " . 
										  "SELECT :schedule_id, :slot_number, :presenter_id, :presentation_title, :keywords, :grade " .
										  "FROM (SELECT COUNT(*) AS cnt FROM `schedule_records` WHERE schedule_id = :schedule_id AND presenter_id = :presenter_id) as T, " .
										  "	  (SELECT COUNT(*) AS cnt FROM `users` WHERE `users`.id = :presenter_id AND `users`.type = 'ADMIN') as U " .
										  "WHERE (T.cnt < :MAX_PRESENTATIONS AND :schedule_id IN ( SELECT id FROM `schedules` WHERE is_active = TRUE )) OR U.cnt > 0");
		$config = parse_ini_file('../config/app.ini', true);
		return $statement->execute($sr->jsonSerialize() + ['MAX_PRESENTATIONS' => $config['app']['MAX_PRESENTATIONS']]);
	}
	public static function UpdateScheduleRecord(ScheduleRecord $sr, ?PDO $connection = null): bool
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$statement = $connection->prepare("UPDATE `schedule_records` sr, ( SELECT id FROM `users` WHERE type = 'ADMIN' ) as adm " .
													"SET sr.presentation_title = :presentation_title, sr.keywords = :keywords, sr.grade = :grade ". 
													"WHERE sr.schedule_id = :schedule_id AND sr.slot_number = :slot_number AND " . 
														"( ( sr.presenter_id = :presenter_id AND :schedule_id IN ( SELECT id FROM `schedules` WHERE is_active = TRUE ) ) OR adm.id = :presenter_id )");
		return $statement->execute($sr->jsonSerialize());
	}
	public static function DeleteSchedule(int $id, ?PDO $connection = null): bool
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$statement = $connection->prepare("DELETE FROM `schedule_records` WHERE schedule_id = :id;" .
													"DELETE FROM `schedules` WHERE id = :id");
		return $statement->execute(['id' => $id]);
	}
	public static function DeleteScheduleRecord(int $schedule_id, int $slot_number, int $requested_from_userid, ?PDO $connection = null): bool
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$statement = $connection->prepare("DELETE FROM `schedule_records` WHERE schedule_id = :schedule_id AND slot_number = :slot_number AND " .
													"((presenter_id = :requested_from_userid AND :schedule_id IN ( SELECT id FROM `schedules` WHERE is_active = TRUE ) ) OR :requested_from_userid IN ( SELECT id FROM `users` WHERE type = 'ADMIN'))");
		return $statement->execute(['schedule_id' => $schedule_id, 'slot_number' => $slot_number, 'requested_from_userid' => $requested_from_userid]);
	}
	public static function SetScheduleActiveStatus(int $schedule_id, bool $newStatus, ?PDO $connection = null): bool
	{
		$connection = $connection ?? RequestHandler::ConnectToDB();
		$statement = $connection->prepare("UPDATE `schedules` SET is_active = :is_active WHERE id = :id");
		return $statement->execute(['id' => $schedule_id, 'is_active' => $newStatus]);
	}
}

?>
