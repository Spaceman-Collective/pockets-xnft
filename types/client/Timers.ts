type TimerType = "rf" | "station"

type Timer = {
	[key in TimerType]?: string
} & {
	id: string
	character: string
	started: string
	finished: string
}

export interface Timers {
	stationTimers: Timer[]
	rfTimers: Timer[]
}
