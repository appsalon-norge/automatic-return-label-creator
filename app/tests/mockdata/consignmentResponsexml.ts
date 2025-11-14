const consignmentResponseXml = `<?xml version="1.0" encoding="UTF-8"?>
<consignments>
    <consignment>
        <id type="integer">79758</id>
        <number>4017071219010402018</number>
        <consignor-reference>Order #1234554</consignor-reference>
        <consignee-reference>Customer return from Test Testesen</consignee-reference>
        <tod-code nil="true"/>
        <tod-country nil="true"/>
        <tod-postcode nil="true"/>
        <tod-city nil="true"/>
        <freight-payer-key>consignor</freight-payer-key>
        <collection-id type="integer" nil="true"/>
        <transport-agreement-id type="integer">1357</transport-agreement-id>
        <product-id type="integer">281</product-id>
        <created-at type="dateTime">2025-11-10T14:52:47Z</created-at>
        <updated-at type="dateTime">2025-11-10T14:52:47Z</updated-at>
        <carrier-message nil="true"/>
        <consignee-message nil="true"/>
        <booking-request type="boolean">false</booking-request>
        <state>open</state>
        <transfer-at type="dateTime" nil="true"/>
        <consignment-transfer-group-id type="integer" nil="true"/>
        <email-label-to-consignee type="boolean">true</email-label-to-consignee>
        <email-notification-to-consignee type="boolean">false</email-notification-to-consignee>
        <number-with-checksum>40170712190104020187</number-with-checksum>
        <bundles type="array">
            <bundle>
                <id type="integer">87364</id>
                <description>Retur: Skjorte – størrelse L</description>
                <load-meter type="integer">0</load-meter>
                <weight type="float">1.2</weight>
                <volume type="integer">0</volume>
                <length type="integer">0</length>
                <height type="integer">0</height>
                <width type="integer">0</width>
                <pallet-places type="integer">0</pallet-places>
                <insurance-amount type="integer">0</insurance-amount>
                <consignment-id type="integer">79758</consignment-id>
                <bundle-type-id type="integer">211</bundle-type-id>
                <created-at type="dateTime">2025-11-10T14:52:47Z</created-at>
                <updated-at type="dateTime">2025-11-10T14:52:47Z</updated-at>
                <exchange-pallets type="integer">0</exchange-pallets>
                <commodity-code nil="true"/>
                <unit-value type="integer">0</unit-value>
                <country-of-origin nil="true"/>
                <net-weight type="integer">0</net-weight>
                <bundle-type>
                    <identifier>package</identifier>
                    <abbreviation>PK</abbreviation>
                </bundle-type>
                <pieces type="array">
                    <piece>
                        <id type="integer">111161</id>
                        <number>0037071219015193514</number>
                        <printed type="boolean" nil="true"/>
                        <bundle-id type="integer">87364</bundle-id>
                        <created-at type="dateTime">2025-11-10T14:52:47Z</created-at>
                        <updated-at type="dateTime">2025-11-10T14:52:47Z</updated-at>
                        <number-with-checksum>00370712190151935145</number-with-checksum>
                    </piece>
                </pieces>
                <dangerous-goods-declarations type="array"/>
            </bundle>
        </bundles>
        <addresses type="array">
            <address type="ConsigneeAddress">
                <id type="integer">121222</id>
                <number nil="true"/>
                <name>Test Testesen</name>
                <address1>Testveien 1</address1>
                <address2 nil="true"/>
                <postcode>0000</postcode>
                <city>By</city>
                <country>NO</country>
                <postbox nil="true"/>
                <postbox-postcode nil="true"/>
                <postbox-city nil="true"/>
                <email>bendik@appsalon.no</email>
                <phone nil="true"/>
                <mobile>40000000</mobile>
                <fax nil="true"/>
                <contact-person nil="true"/>
                <customer-number nil="true"/>
                <freight-payer type="boolean" nil="true"/>
                <consignment-id type="integer">79758</consignment-id>
                <created-at type="dateTime">2025-11-10T14:52:47Z</created-at>
                <updated-at type="dateTime">2025-11-10T14:52:47Z</updated-at>
                <agent-number nil="true"/>
                <reference nil="true"/>
            </address>
        </addresses>
        <services type="array"/>
        <transport-agreement>
            <id type="integer">1357</id>
            <number>12345678</number>
            <description>Test account for Bring - New services</description>
            <carrier>
                <name>Bring</name>
                <identifier>bring2</identifier>
            </carrier>
        </transport-agreement>
        <product>
            <id type="integer">281</id>
            <name>Retur fra hentested</name>
            <identifier>bring2_return_pickup_point</identifier>
        </product>
        <tags>
    </tags>
        <values>
            <value name="orderno" value="1234554"/>
            <value name="return_reason" value="Too small – customer requested exchange"/>
            <value name="reversefulfillmentorders" value="RFO-1001"/>
        </values>
        <consignment-pdf>https://sandbox.cargonizer.no/consignments/label_pdf?consignment_ids%5B%5D=79758</consignment-pdf>
        <waybill-pdf>https://sandbox.cargonizer.no/consignments/waybill_pdf?consignment_ids%5B%5D=79758</waybill-pdf>
        <tracking-url>https://sporing.bring.no/sporing/40170712190104020187</tracking-url>
        <print-result>PDF OK Test DirectPrint 1 963.963.963.963 -- DEPRECATED: Automatic printing from API is deprecated and will be removed. Please make sure to add print="false" to your &lt;consignment&gt; and use the dedicated printing endpoint, POST /consignments/label_direct?printer_id=X&amp;consignment_ids[]=Y</print-result>
    </consignment>
</consignments>`;

export default consignmentResponseXml;
