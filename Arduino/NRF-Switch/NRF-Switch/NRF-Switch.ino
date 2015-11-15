#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"
#include "printf.h"

RF24 radio(9, 10);
const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };
char RecvPayload[31] = "";
bool isOn = false;

void setup()
{
	Serial.begin(57600);
	printf_begin();
	printf("NRF-Switch\r\n");

	radio.begin();
	radio.setRetries(15, 15);
	radio.enableDynamicPayloads();
	radio.openWritingPipe(pipes[0]);
	radio.openReadingPipe(1, pipes[1]);
	radio.startListening();
	radio.printDetails();
}

void loop()
{
	char* received = nrfReceive();
	if (received != NULL)
	{
		radio.stopListening();

		nrfCreateResponse(received);

		radio.startListening();
	}
}

char* nrfReceive() 
{
	if (radio.available())
	{
		printf("Waiting for message.\n\r");

		int len = 0;
		while (radio.available()) {
			len = radio.getDynamicPayloadSize();
			radio.read(&RecvPayload, len);
			delay(100);
		}
		char* received = RecvPayload;
		printf("Received: ");
		printf(received);
		printf("\r\n");
		RecvPayload[len] = 0; // null terminate string
		return received;
	}
	
	return NULL;
}

void nrfCreateResponse(char* message)
{
	if (message == "sutats")
	{
		radio.write(&isOn, sizeof(bool));
		printf("Sent response.\n\r");
	}
	else if (message == "sutats_egnahc")
	{
		isOn = !isOn;
		radio.write(&isOn, sizeof(bool));
		printf("Sent response.\n\r");
	}
}