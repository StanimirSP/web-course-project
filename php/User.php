<?php

class User implements JsonSerializable
{
	private $id;
	private $faculty_number;
	private $username;
	private $email;
	private $password;
	private $type;

	public static function createFromJSON(array $userInfo): User
	{
		return new User($userInfo['id'],
						$userInfo['faculty_number'],
						$userInfo['username'],
						$userInfo['email'],
						$userInfo['password'],
						$userInfo['type']
		);
	}
	public function __construct(int $id, string $faculty_number, string $username, string $email, string $password, string $type)
	{
		if(preg_match('/^[0-9]{5,6}$/', $faculty_number) == 0)
			throw new InvalidArgumentException('invalid faculty number');
		if(preg_match('/^.{3,16}$/', $username) == 0)
			throw new InvalidArgumentException('invalid username');
		if(preg_match('/^[^@]+@[^@]+[.][^@]+$/', $email) == 0 || preg_match('/^.{0,64}$/', $email) == 0)
			throw new InvalidArgumentException('invalid email');
		if(preg_match('/^.{6,32}$/', $password) == 0 || preg_match('/[a-z]/', $password) == 0 || preg_match('/[A-Z]/', $password) == 0 || preg_match('/[0-9]/', $password) == 0)
			throw new InvalidArgumentException('invalid password');
		if($type != 'REGULAR' && $type != 'ADMIN')
			throw new InvalidArgumentException('bad user type');
		$this->id = $id;
		$this->faculty_number = $faculty_number;
		$this->username = $username;
		$this->email = $email;
		$this->password = $password;
		$this->type = $type;
	}
	public function getId(): int
	{
		return $this->id;
	}
	public function getFacultyNumber(): string
	{
		return $this->faculty_number;
	}
	public function getUsername(): string
	{
		return $this->name;
	}
	public function getType(): string
	{
		return $this->type;
	}
	public function jsonSerialize(): array
	{
		return [
			"id" => $this->id,
			"faculty_number" => $this->faculty_number,
			"username" => $this->username,
			"email" => $this->email,
			"password" => $this->password,
			"type" => $this->type
		];
	}
}

?>
