import * as signalR from '@microsoft/signalr'
import { HttpTransportType } from '@microsoft/signalr'

import type { TrackerMessageType } from '@/types/trackerType'
import { getSessionUser } from '@/data/getSessionUser'

class Tracker {
  url: string
  connection: signalR.HubConnection
  private static instant?: Tracker = undefined

  constructor() {
    console.log('Create Tracker Class')
    this.url = process.env.TRACKER_URL as string

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.url, HttpTransportType.LongPolling)
      .configureLogging(signalR.LogLevel.Error)
      .build()

    // Print Messages
    // this.connection.on('Send', message => {
    //   console.log(message)
    // })
    // this.connection.on('receivemessage', message => {
    //   console.log(message)
    // })
  }

  static async getInstance() {
    if (!this.instant) {
      console.log('Create Tracker Instance')
      this.instant = new Tracker()
    }

    if (this.instant.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.instant.connection.start()
      } catch (err) {
        console.log(err)

        return undefined
      }

      return this.instant
    } else return this.instant
  }

  async sendMessages(message: TrackerMessageType, user?: string) {
    const _message = {
      ...message,
      Header: `${message.Header} [${process.env.PRG_NAME}]`,
      TimeStamp: `Time: ${message.TimeStamp} s`
    }

    if (!user) {
      user = (await getSessionUser())?.id
    }

    try {
      await this.connection.invoke('AddToGroup', user)
      await this.connection.invoke('SendMessage', user, _message)
      await this.connection.invoke('RemoveFromGroup', user)
      console.log(user, _message)
    } catch (err) {
      console.log(err)
    }
  }
}

export default Tracker
