import { Injectable } from '@angular/core';
import { RxStomp, IMessage } from '@stomp/rx-stomp';
import { Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class SocketServiceService {
  private rxStomp: RxStomp;
  private subscription: Subscription | null = null; 

  constructor() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: 'ws://localhost:8080/ws-web_socket'
    });
    this.rxStomp.activate();
  }

  connect(topic: string, callback: (message: any) => void): void {
    this.subscription = this.rxStomp.watch(topic).subscribe((message: IMessage) => {
      callback(message.body);
    });
  }

  disconnect(): void {
    if (this.subscription) { // Vérifier si la subscription existe
      this.subscription.unsubscribe();
      this.subscription = null; // Réinitialiser la subscription à null
    }
    this.rxStomp.deactivate();
  }

}
