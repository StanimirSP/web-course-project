<?php

class ScheduleRecord implements JsonSerializable
{
	private $schedule_id;
	private $slot_number;
	private $presenter_id;
	private $presentation_title;
	private $keywords;
	private $grade;

	public static function createFromJSON(array $recordInfo): ScheduleRecord
	{
		return new ScheduleRecord($recordInfo['schedule_id'],
								  $recordInfo['slot_number'],
								  $recordInfo['presenter_id'],
								  $recordInfo['presentation_title'],
								  $recordInfo['keywords'],
								  $recordInfo['grade']
		);
	}
	public function __construct(int $schedule_id, int $slot_number, int $presenter_id, string $presentation_title, string $keywords, ?float $grade = null)
	{
		if(preg_match('/^.{1,255}$/', $presentation_title) == 0 || preg_match('/,/', $presentation_title) == 1)
			throw new InvalidArgumentException('invalid title');
		if(preg_match('/^.{1,255}$/', $keywords) == 0 || preg_match('/,/', $keywords) == 1)
			throw new InvalidArgumentException('invalid keywords');
		if($grade!=null && ($grade < 2 || $grade > 6))
			throw new InvalidArgumentException('invalid grade');
		$this->schedule_id = $schedule_id;
		$this->slot_number = $slot_number;
		$this->presenter_id = $presenter_id;
		$this->presentation_title = $presentation_title;
		$this->keywords = $keywords;
		$this->grade = $grade;
	}
	public function jsonSerialize(): array
	{
		return [
			"schedule_id" => $this->schedule_id,
			"slot_number" => $this->slot_number,
			"presenter_id" => $this->presenter_id,
			"presentation_title" => $this->presentation_title,
			"keywords" => $this->keywords,
			"grade" => $this->grade
		];
	}
}

?>
