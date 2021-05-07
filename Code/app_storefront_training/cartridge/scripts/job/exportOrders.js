"use strict";

var Logger = require("dw/system/Logger");
var File = require("dw/io/File");
var OrderMgr = require("dw/order/OrderMgr");
var FileWriter = require("dw/io/FileWriter");
var XMLStreamWriter = require("dw/io/XMLStreamWriter");

/**
 * Entry point for job.
 * Create JSON of orders for Dataroma
 * Save file on IMPEX
 */

function execute(param) {
	var feedDirectory =	File.IMPEX + File.SEPARATOR + "src" + File.SEPARATOR + param.destination + File.SEPARATOR;
	var feedFileName = "orderExport.xml";
	var fullPath = feedDirectory + feedFileName;

	if (!File(feedDirectory).isDirectory()) {
		File(feedDirectory).mkdir();
	}

	var getOrders = OrderMgr.searchOrders(
		"status={0}",
		"creationDate desc",
		dw.order.Order.ORDER_STATUS_NEW
	);

	var file = new File(fullPath);
	var fileWriter = new FileWriter(file, "UTF-8");
	var xsw = new XMLStreamWriter(fileWriter);
	xsw.writeStartDocument();
	xsw.writeStartElement("Orders");

	while (getOrders.hasNext()) {
		var order = getOrders.next();
		if (order) {
			xsw.writeStartElement("order");
			xsw.writeAttribute("no", order.orderNo);
			if (order.getCustomerEmail()) {
				xsw.writeStartElement("email");
				xsw.writeCharacters(order.getCustomerEmail());
				xsw.writeEndElement();
			}
			if (order.getCustomerName()) {
				xsw.writeStartElement("customerName");
				xsw.writeCharacters(order.getCustomerName());
				xsw.writeEndElement();
			}
			if (order.getCustomerNo()) {
				xsw.writeStartElement("customerNo");
				xsw.writeCharacters(order.getCustomerNo());
				xsw.writeEndElement();
			}

			var productCollection = order.getAllProductLineItems().toArray();
			if(productCollection){
				xsw.writeStartElement("productIDS");
				productCollection.forEach(function(product) {
					xsw.writeCharacters(product.productID);
				});
				xsw.writeEndElement();
			}
			xsw.writeStartElement("total");
			xsw.writeCharacters(order.totalGrossPrice);
			xsw.writeEndElement();
			xsw.writeEndElement();
		}
	}
	xsw.writeEndElement();
	xsw.writeEndDocument();
	xsw.close();
}
module.exports.execute = execute;
