#include <SPI.h>
#include "nRF24L01.h"
#include "RF24.h"
#include "printf.h"

RF24 radio(9, 10);
const uint64_t pipes[2] = { 0xF0F0F0F0E1LL, 0xF0F0F0F0D2LL };
const int pin = 7;
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

	pinMode(pin, OUTPUT);
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
	if (message[0] == '1')
	{
		int len = radio.getDynamicPayloadSize();
		if (isOn)
			radio.write("1", len);
		else
			radio.write("0", len);

		printf("Sent response.\n\r");
	}
	else if (message[0] == '2')
	{
		isOn = !isOn;
		int len = radio.getDynamicPayloadSize();
		if (isOn)
		{
			digitalWrite(pin, HIGH);
			radio.write("1", len);
		}
		else
		{
			digitalWrite(pin, LOW);
			radio.write("0", len);
		}

		printf("Changed status and sent response.\n\r");
	}
}