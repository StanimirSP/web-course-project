<?php

require_once('ScheduleQueries.php');

try
{
	switch ($_SERVER['REQUEST_METHOD']) {
		case 'GET':
		{
			RequestHandler::requireUserPermissions();
			if(!isset($_GET['id']))
			{
				$allSchedules = ScheduleQueries::GetAllSchedules();
				//$allSchedules['success'] = true;
				echo json_encode($allSchedules, JSON_UNESCAPED_UNICODE);
			}
			else
			{
				$scheduleInfo = ScheduleQueries::GetScheduleById($_GET['id']);
				if($scheduleInfo)
				{
					//$scheduleInfo['success'] = true;
					echo json_encode($scheduleInfo, JSON_UNESCAPED_UNICODE);
				}
				else echo json_encode(['success' => false, 'msg' => "schedule not found"]);
			}
			break;
		}
		case 'POST':
		{
			RequestHandler::requireAdminPermissions();
			$scheduleInfo = json_decode(file_get_contents("php://input"), true);
			$scheduleInfo['id'] = 0; // auto increment
			$scheduleInfo['is_active'] = true; // schedules are created with active status
			$scheduleInfo['created_by'] = $_SESSION['id'];
			$result = ScheduleQueries::CreateSchedule(Schedule::createFromJSON($scheduleInfo));
			if($result != null)
				echo json_encode(['success' => true, 'inserted_id' => $result]);
			else
				echo json_encode(['success' => false]);
			break;
		}
		case 'PUT':
		{
			RequestHandler::requireAdminPermissions();
			$scheduleInfo = json_decode(file_get_contents("php://input"), true);
			$flag = ScheduleQueries::SetScheduleActiveStatus($scheduleInfo['schedule_id'], $scheduleInfo['is_active']);
			echo json_encode(['success' => $flag]);
			break;
		}
		case 'DELETE':
		{
			RequestHandler::requireAdminPermissions();
			$scheduleInfo = json_decode(file_get_contents("php://input"), true);
			$deleted = ScheduleQueries::DeleteSchedule($scheduleInfo['id']);
			echo json_encode(['success' => $deleted]);
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
