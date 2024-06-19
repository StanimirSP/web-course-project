<?php

class Schedule implements JsonSerializable
{
	private $id;
	private $title;
	private $date;
	private $schedule_start;
	private $schedule_end;
	private $schedule_step;
	private $is_active;
	private $created_by;

	private static function TimeToMin(DateTime $time): int
	{
		return $time->format("H")*60 + $time->format("i");
	}
	private function timesAreCorrect(): bool
	{
		$start = self::TimeToMin($this->schedule_start);
		$end = self::TimeToMin($this->schedule_end);
		$step = self::TimeToMin($this->schedule_step);
		return $start < $end && $step <= $end-$start && $step > 0;
	}
	public static function createFromJSON(array $scheduleInfo): Schedule
	{
		return new Schedule($scheduleInfo['id'],
							$scheduleInfo['title'],
							$scheduleInfo['date'],
							$scheduleInfo['schedule_start'],
							$scheduleInfo['schedule_end'],
							$scheduleInfo['schedule_step'],
							$scheduleInfo['is_active'],
							$scheduleInfo['created_by']
		);
	}
	public function __construct(int $id, string $title, string $date, string $schedule_start, string $schedule_end, string $schedule_step, bool $is_active, int $created_by)
	{
		if(preg_match('/^.{1,255}$/', $title) == 0 || preg_match('/,/', $title) == 1)
			throw new InvalidArgumentException('invalid title');
		$this->id = $id;
		$this->title = $title;
		$this->date = DateTime::createFromFormat("Y-m-d", $date);
		$this->schedule_start = DateTime::createFromFormat("H:i", $schedule_start);
		$this->schedule_end = DateTime::createFromFormat("H:i", $schedule_end);
		$this->schedule_step = DateTime::createFromFormat("H:i", $schedule_step);
		if(!$this->date || !$this->schedule_start || !$this->schedule_end || !$this->schedule_step)
			throw new LogicException("Invalid date/time");
		if(!$this->timesAreCorrect())
			throw new LogicException("Starting time must precede ending time and the interval must be large enough for atleast one presentation");
		$this->is_active = $is_active;
		$this->created_by = $created_by;
	}
	public function getId(): int
	{
		return $this->id;
	}
	public function getTitle(): string
	{
		return $this->title;
	}
	public function getStartTime(): DateTime
	{
		return $this->schedule_start;
	}
	public function getEndTime(): DateTime
	{
		return $this->schedule_end;
	}
	public function getStep(): DateTime
	{
		return $this->schedule_step;
	}
	public function jsonSerialize(): array
	{
		return [
			"id" => $this->id,
			"title" => $this->title,
			"date" => $this->date->format("Y-m-d"),
			"schedule_start" => $this->schedule_start->format("H:i"),
			"schedule_end" => $this->schedule_end->format("H:i"),
			"schedule_step" => $this->schedule_step->format("H:i"),
			"is_active" => $this->is_active,
			"created_by" => $this->created_by
		];
	}
}

?>
