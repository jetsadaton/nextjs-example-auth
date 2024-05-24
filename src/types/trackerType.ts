export type TrackerMessageType = {
  Header: string
  Body: string
  Footer: string
  TimeStamp: string
  MessageType?: signalR.MessageType
}
