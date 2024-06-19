<?php

require_once('Schedule.php');
require_once('ScheduleRecord.php');
require_once('ScheduleQueries.php');

try
{
	switch ($_SERVER['REQUEST_METHOD']) {
		case 'POST':
		{
			RequestHandler::requireAdminPermissions();
			$scheduleInfo = json_decode(file_get_contents("php://input"), true);
			$scheduleInfo[0]['id'] = 0; // auto increment
			$scheduleInfo[0]['created_by'] = $_SESSION['id'];
			$connection = RequestHandler::ConnectToDB();
			$connection->beginTransaction();
			$schedule_id = ScheduleQueries::CreateSchedule(Schedule::createFromJSON($scheduleInfo[0]), $connection);
			if($schedule_id == null)
			{
				$connection->rollBack();
				echo json_encode(['success' => false]);
				break;
			}
			for($i = 1; $i < count($scheduleInfo); $i++)
			{
				$scheduleInfo[$i]['schedule_id'] = $schedule_id;
				$inserted = ScheduleQueries::AddScheduleRecord(ScheduleRecord::createFromJSON($scheduleInfo[$i]), $connection);
				if(!$inserted)
				{
					$connection->rollBack();
					echo json_encode(['success' => false]);
					break;
				}
			}
			if($connection->commit())
				echo json_encode(['success' => true, 'inserted_id' => $schedule_id]);
			else
				echo json_encode(['success' => false]);
			break;
		}
		default:
			throw new LogicException("bad request method");
	}
}
catch(Exception $e)
{
	echo json_encode(['success' => false, 'msg' => $e->getMessage()]);
}

?>
