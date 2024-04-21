
const MessageType = {
  echo : "echo",
  predict : "predict",
}

export class ObcApi {
  serviceAddress: string;

  constructor(serviceAddress: string) {
    this.serviceAddress = serviceAddress;
  }

  makeUrl(type: string, message: string) {
    const resource = `${type}/${message}`;
    return new URL(resource, this.serviceAddress);
  }

  echo(message: string) {
    const url = this.makeUrl(MessageType.echo, message);
    return fetch(url.toString())
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  predict(data: number[]) {
    const url = new URL(MessageType.predict, this.serviceAddress);
    const body = JSON.stringify({ data });
    return fetch(url.toString(), {
      method: "POST",
      headers: { 
      },
      body: body,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => console.error(error));
  }
 
}