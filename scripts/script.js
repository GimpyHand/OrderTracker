let orderCounter = Math.floor(Math.random() * 1000);
let isReceivingOrders = false;
let orderGeneratorInterval = null;

const orderStatuses = {
	incoming: {
		label: "Incoming",
		bgClass: "bg-blue-500/20",
		textClass: "text-blue-400",
	},
	picking: {
		label: "Picking",
		bgClass: "bg-yellow-500/20",
		textClass: "text-yellow-400",
	},
	packing: {
		label: "Packing",
		bgClass: "bg-orange-500/20",
		textClass: "text-orange-400",
	},
	shipping: {
		label: "Shipping",
		bgClass: "bg-purple-500/20",
		textClass: "text-purple-400",
	},
	delivering: {
		label: "Out for Delivery",
		bgClass: "bg-blue-500/20",
		textClass: "text-blue-400",
	},
	delivered: {
		label: "Delivered",
		bgClass: "bg-green-500/20",
		textClass: "text-green-400",
	},
	failed: {
		label: "Failed",
		bgClass: "bg-red-500/20",
		textClass: "text-red-400",
	},
};

const stageOrder = [
	"picking",
	"packing",
	"shipping",
	"delivering",
	"delivered",
];

const productCategories = {
	processors: {
		brands: ["Intel", "AMD", "Apple"],
		types: [
			{ name: "Core i5", minPrice: 180, maxPrice: 280 },
			{ name: "Core i7", minPrice: 300, maxPrice: 450 },
			{ name: "Core i9", minPrice: 450, maxPrice: 650 },
			{ name: "Ryzen 5", minPrice: 150, maxPrice: 250 },
			{ name: "Ryzen 7", minPrice: 280, maxPrice: 400 },
			{ name: "Ryzen 9", minPrice: 400, maxPrice: 600 },
			{ name: "M3 Pro", minPrice: 400, maxPrice: 500 },
			{ name: "M3 Max", minPrice: 600, maxPrice: 800 },
		],
	},
	graphics: {
		brands: ["NVIDIA", "AMD", "ASUS", "MSI", "EVGA", "Gigabyte"],
		types: [
			{ name: "RTX 4060", minPrice: 299, maxPrice: 350 },
			{ name: "RTX 4070", minPrice: 549, maxPrice: 650 },
			{ name: "RTX 4080", minPrice: 999, maxPrice: 1200 },
			{ name: "RTX 4090", minPrice: 1599, maxPrice: 2000 },
			{ name: "RX 7600", minPrice: 249, maxPrice: 300 },
			{ name: "RX 7800 XT", minPrice: 449, maxPrice: 550 },
			{ name: "RX 7900 XTX", minPrice: 899, maxPrice: 1100 },
		],
	},
	memory: {
		brands: ["Corsair", "G.Skill", "Kingston", "Crucial", "TeamGroup"],
		types: [
			{ name: "16GB DDR4", minPrice: 45, maxPrice: 70 },
			{ name: "32GB DDR4", minPrice: 80, maxPrice: 120 },
			{ name: "16GB DDR5", minPrice: 70, maxPrice: 100 },
			{ name: "32GB DDR5", minPrice: 120, maxPrice: 180 },
			{ name: "64GB DDR5", minPrice: 220, maxPrice: 320 },
		],
	},
	storage: {
		brands: ["Samsung", "Western Digital", "Seagate", "Crucial", "SK Hynix"],
		types: [
			{ name: "500GB NVMe SSD", minPrice: 45, maxPrice: 70 },
			{ name: "1TB NVMe SSD", minPrice: 80, maxPrice: 120 },
			{ name: "2TB NVMe SSD", minPrice: 150, maxPrice: 220 },
			{ name: "4TB NVMe SSD", minPrice: 300, maxPrice: 450 },
			{ name: "2TB HDD", minPrice: 50, maxPrice: 70 },
			{ name: "4TB HDD", minPrice: 80, maxPrice: 110 },
			{ name: "8TB HDD", minPrice: 140, maxPrice: 200 },
		],
	},
	monitors: {
		brands: ["LG", "Samsung", "ASUS", "Dell", "BenQ", "Acer", "ViewSonic"],
		types: [
			{ name: '24" 1080p 144Hz', minPrice: 150, maxPrice: 220 },
			{ name: '27" 1440p 144Hz', minPrice: 280, maxPrice: 380 },
			{ name: '27" 1440p 240Hz', minPrice: 400, maxPrice: 550 },
			{ name: '27" 4K 144Hz', minPrice: 550, maxPrice: 750 },
			{ name: '32" 4K 144Hz', minPrice: 700, maxPrice: 1000 },
			{ name: '34" Ultrawide 1440p', minPrice: 450, maxPrice: 650 },
			{ name: '49" Super Ultrawide', minPrice: 900, maxPrice: 1500 },
		],
	},
	televisions: {
		brands: ["LG", "Samsung", "Sony", "TCL", "Hisense", "Vizio"],
		types: [
			{ name: '43" 4K Smart TV', minPrice: 250, maxPrice: 400 },
			{ name: '55" 4K Smart TV', minPrice: 350, maxPrice: 550 },
			{ name: '65" 4K Smart TV', minPrice: 500, maxPrice: 800 },
			{ name: '55" OLED TV', minPrice: 1000, maxPrice: 1500 },
			{ name: '65" OLED TV', minPrice: 1500, maxPrice: 2200 },
			{ name: '75" 4K Smart TV', minPrice: 800, maxPrice: 1200 },
			{ name: '85" 4K Smart TV', minPrice: 1200, maxPrice: 2000 },
		],
	},
	peripherals: {
		brands: ["Logitech", "Razer", "Corsair", "SteelSeries", "HyperX"],
		types: [
			{ name: "Mechanical Keyboard", minPrice: 80, maxPrice: 180 },
			{ name: "Gaming Mouse", minPrice: 50, maxPrice: 150 },
			{ name: "Wireless Headset", minPrice: 80, maxPrice: 200 },
			{ name: "Webcam 1080p", minPrice: 60, maxPrice: 100 },
			{ name: "Webcam 4K", minPrice: 150, maxPrice: 250 },
			{ name: "Mousepad XL", minPrice: 25, maxPrice: 50 },
			{ name: "USB Hub", minPrice: 20, maxPrice: 45 },
		],
	},
	components: {
		brands: [
			"ASUS",
			"MSI",
			"Gigabyte",
			"ASRock",
			"NZXT",
			"Corsair",
			"be quiet!",
		],
		types: [
			{ name: "ATX Motherboard", minPrice: 150, maxPrice: 350 },
			{ name: "Mini-ITX Motherboard", minPrice: 180, maxPrice: 300 },
			{ name: "650W PSU", minPrice: 70, maxPrice: 120 },
			{ name: "850W PSU", minPrice: 120, maxPrice: 180 },
			{ name: "1000W PSU", minPrice: 180, maxPrice: 280 },
			{ name: "Mid Tower Case", minPrice: 80, maxPrice: 150 },
			{ name: "Full Tower Case", minPrice: 150, maxPrice: 300 },
			{ name: "AIO Cooler 240mm", minPrice: 100, maxPrice: 160 },
			{ name: "AIO Cooler 360mm", minPrice: 150, maxPrice: 250 },
			{ name: "Air Cooler", minPrice: 40, maxPrice: 100 },
		],
	},
	networking: {
		brands: ["ASUS", "TP-Link", "Netgear", "Ubiquiti", "Linksys"],
		types: [
			{ name: "WiFi 6 Router", minPrice: 100, maxPrice: 200 },
			{ name: "WiFi 6E Router", minPrice: 200, maxPrice: 400 },
			{ name: "Mesh WiFi System", minPrice: 250, maxPrice: 500 },
			{ name: "Network Switch 8-Port", minPrice: 25, maxPrice: 60 },
			{ name: "Network Switch 16-Port", minPrice: 80, maxPrice: 150 },
			{ name: "WiFi Adapter", minPrice: 30, maxPrice: 70 },
			{ name: "Ethernet Cable 10ft", minPrice: 8, maxPrice: 20 },
		],
	},
	accessories: {
		brands: ["Anker", "Belkin", "Cable Matters", "StarTech", "UGREEN"],
		types: [
			{ name: "USB-C Hub", minPrice: 30, maxPrice: 80 },
			{ name: "Thunderbolt Dock", minPrice: 200, maxPrice: 400 },
			{ name: "Monitor Arm", minPrice: 30, maxPrice: 100 },
			{ name: "Laptop Stand", minPrice: 25, maxPrice: 60 },
			{ name: "Cable Management Kit", minPrice: 15, maxPrice: 35 },
			{ name: "Surge Protector", minPrice: 20, maxPrice: 50 },
			{ name: "UPS Battery Backup", minPrice: 100, maxPrice: 250 },
		],
	},
};

const firstNames = [
	"James",
	"Mary",
	"John",
	"Patricia",
	"Robert",
	"Jennifer",
	"Michael",
	"Linda",
	"William",
	"Elizabeth",
	"David",
	"Barbara",
	"Richard",
	"Susan",
	"Joseph",
	"Jessica",
	"Thomas",
	"Sarah",
	"Charles",
	"Karen",
	"Christopher",
	"Lisa",
	"Daniel",
	"Nancy",
	"Matthew",
	"Betty",
	"Anthony",
	"Margaret",
	"Mark",
	"Sandra",
	"Donald",
	"Ashley",
	"Steven",
	"Kimberly",
	"Paul",
	"Emily",
	"Andrew",
	"Donna",
	"Joshua",
	"Michelle",
	"Kenneth",
	"Dorothy",
	"Kevin",
	"Carol",
	"Brian",
	"Amanda",
	"George",
	"Melissa",
	"Timothy",
	"Deborah",
	"Ronald",
	"Stephanie",
	"Edward",
	"Rebecca",
	"Jason",
	"Sharon",
	"Jeffrey",
	"Laura",
	"Ryan",
	"Cynthia",
	"Jacob",
	"Kathleen",
	"Gary",
	"Amy",
	"Nicholas",
	"Angela",
	"Eric",
	"Shirley",
	"Jonathan",
	"Anna",
	"Stephen",
	"Brenda",
	"Larry",
	"Pamela",
	"Justin",
	"Emma",
	"Scott",
	"Nicole",
	"Brandon",
	"Helen",
	"Benjamin",
	"Samantha",
	"Samuel",
	"Katherine",
	"Raymond",
	"Christine",
	"Gregory",
	"Debra",
	"Frank",
	"Rachel",
	"Alexander",
	"Carolyn",
	"Patrick",
	"Janet",
	"Jack",
	"Catherine",
	"Dennis",
	"Maria",
	"Jerry",
	"Heather",
	"Tyler",
	"Diane",
	"Aaron",
	"Ruth",
	"Jose",
	"Julie",
	"Adam",
	"Olivia",
	"Nathan",
	"Joyce",
	"Henry",
	"Virginia",
	"Douglas",
	"Victoria",
	"Zachary",
	"Kelly",
	"Peter",
	"Lauren",
	"Kyle",
	"Christina",
	"Noah",
	"Joan",
	"Ethan",
	"Evelyn",
	"Jeremy",
	"Judith",
	"Walter",
	"Megan",
	"Christian",
	"Andrea",
	"Keith",
	"Cheryl",
	"Roger",
	"Hannah",
	"Terry",
	"Jacqueline",
	"Austin",
	"Martha",
	"Sean",
	"Gloria",
	"Gerald",
	"Teresa",
	"Carl",
	"Ann",
	"Dylan",
	"Sara",
	"Harold",
	"Madison",
	"Jordan",
	"Frances",
	"Jesse",
	"Kathryn",
	"Bryan",
	"Janice",
	"Lawrence",
	"Jean",
	"Arthur",
	"Abigail",
	"Gabriel",
	"Alice",
];

const lastNames = [
	"Smith",
	"Johnson",
	"Williams",
	"Brown",
	"Jones",
	"Garcia",
	"Miller",
	"Davis",
	"Rodriguez",
	"Martinez",
	"Hernandez",
	"Lopez",
	"Gonzalez",
	"Wilson",
	"Anderson",
	"Thomas",
	"Taylor",
	"Moore",
	"Jackson",
	"Martin",
	"Lee",
	"Perez",
	"Thompson",
	"White",
	"Harris",
	"Sanchez",
	"Clark",
	"Ramirez",
	"Lewis",
	"Robinson",
	"Walker",
	"Young",
	"Allen",
	"King",
	"Wright",
	"Scott",
	"Torres",
	"Nguyen",
	"Hill",
	"Flores",
	"Green",
	"Adams",
	"Nelson",
	"Baker",
	"Hall",
	"Rivera",
	"Campbell",
	"Mitchell",
	"Carter",
	"Roberts",
	"Gomez",
	"Phillips",
	"Evans",
	"Turner",
	"Diaz",
	"Parker",
	"Cruz",
	"Edwards",
	"Collins",
	"Reyes",
	"Stewart",
	"Morris",
	"Morales",
	"Murphy",
	"Cook",
	"Rogers",
	"Gutierrez",
	"Ortiz",
	"Morgan",
	"Cooper",
	"Peterson",
	"Bailey",
	"Reed",
	"Kelly",
	"Howard",
	"Ramos",
	"Kim",
	"Cox",
	"Ward",
	"Richardson",
	"Watson",
	"Brooks",
	"Chavez",
	"Wood",
	"James",
	"Bennett",
	"Gray",
	"Mendoza",
	"Ruiz",
	"Hughes",
	"Price",
	"Alvarez",
	"Castillo",
	"Sanders",
	"Patel",
	"Myers",
	"Long",
	"Ross",
	"Foster",
	"Jimenez",
	"Powell",
	"Jenkins",
	"Perry",
	"Russell",
	"Sullivan",
	"Bell",
	"Coleman",
	"Butler",
	"Henderson",
	"Barnes",
	"Gonzales",
	"Fisher",
	"Vasquez",
	"Simmons",
	"Stokes",
	"Simpson",
	"Crawford",
	"Porter",
	"Mason",
	"Shaw",
	"Gordon",
	"Wagner",
	"Hunter",
	"Romero",
	"Hicks",
	"Dixon",
	"Hunt",
];

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOrderNumber() {
	orderCounter++;
	return orderCounter;
}

function generateRandomProduct() {
	const categoryKeys = Object.keys(productCategories);
	const categoryKey = categoryKeys[getRandomInt(0, categoryKeys.length - 1)];
	const category = productCategories[categoryKey];

	const brand = category.brands[getRandomInt(0, category.brands.length - 1)];
	const type = category.types[getRandomInt(0, category.types.length - 1)];
	const price = getRandomInt(type.minPrice, type.maxPrice) + 0.99;

	return {
		name: `${brand} ${type.name}`,
		price: price,
		category: categoryKey,
	};
}

function generateRandomCustomer() {
	const firstName = firstNames[getRandomInt(0, firstNames.length - 1)];
	const lastName = lastNames[getRandomInt(0, lastNames.length - 1)];
	return `${firstName} ${lastName}`;
}

function generateRandomOrder() {
	const numItems = getRandomInt(1, 6);
	const items = [];
	const usedProductNames = new Set();

	for (let i = 0; i < numItems; i++) {
		let product;
		let attempts = 0;

		do {
			product = generateRandomProduct();
			attempts++;
		} while (usedProductNames.has(product.name) && attempts < 20);

		usedProductNames.add(product.name);
		items.push({
			name: product.name,
			quantity: getRandomInt(1, 3),
			price: product.price,
			category: product.category,
		});
	}

	const total = items.reduce(
		(sum, item) => sum + item.quantity * item.price,
		0,
	);
	const customer = generateRandomCustomer();
	const distance = getRandomInt(1, 20);

	return {
		orderNo: generateOrderNumber(),
		customer: customer,
		items: items,
		total: total,
		distance: distance,
	};
}

function createIncomingOrderCard(orderData) {
	const container = document.getElementById("incoming-orders");
	const orderNo = orderData.orderNo;
	const status = "incoming";

	const cardDiv = document.createElement("div");
	cardDiv.classList.add(
		"bg-gray-700/50",
		"border",
		"border-gray-600",
		"rounded-lg",
		"shadow-lg",
		"flex",
		"flex-col",
		"hover:bg-gray-700",
		"transition-all",
		"duration-200",
		"h-80",
	);
	cardDiv.id = `incoming-order-${orderNo}`;

	const cardHeader = document.createElement("div");
	cardHeader.classList.add(
		"flex",
		"items-center",
		"justify-between",
		"px-4",
		"py-2",
		"bg-gray-800/50",
		"rounded-t-lg",
		"border-b",
		"border-gray-600",
	);

	const orderTitle = document.createElement("span");
	orderTitle.classList.add("text-white", "font-semibold", "text-sm");
	orderTitle.innerText = `Order #${orderNo}`;

	const statusBadge = document.createElement("span");
	const statusInfo = orderStatuses[status];
	statusBadge.classList.add(
		"px-2",
		"py-1",
		statusInfo.bgClass,
		statusInfo.textClass,
		"text-xs",
		"rounded-full",
		"font-medium",
	);
	statusBadge.innerText = statusInfo.label;

	cardHeader.append(orderTitle, statusBadge);

	const cardBody = document.createElement("div");
	cardBody.classList.add(
		"px-4",
		"py-2",
		"flex-1",
		"overflow-y-auto",
		"min-h-0",
	);

	const items = orderData.items || [
		{ name: "Item 1", quantity: 1, price: 25.0 },
	];

	let tableRows = "";
	let total = 0;

	items.forEach((item, index) => {
		const itemTotal = item.quantity * item.price;
		total += itemTotal;
		tableRows += `
			<tr class="border-b border-gray-600/50">
				<td class="py-1 text-gray-400">${index + 1}</td>
				<td class="py-1 text-gray-300">${item.name}</td>
				<td class="py-1 text-gray-400 text-center">${item.quantity}</td>
				<td class="py-1 text-gray-300 text-right">$${Number(item.price).toFixed(2)}</td>
			</tr>
		`;
	});

	cardBody.innerHTML = `
		<table class="w-full text-xs">
			<thead>
				<tr class="border-b border-gray-600 text-gray-400">
					<th class="py-1 text-left font-medium">#</th>
					<th class="py-1 text-left font-medium">Item</th>
					<th class="py-1 text-center font-medium">Qty</th>
					<th class="py-1 text-right font-medium">Price</th>
				</tr>
			</thead>
			<tbody>
				${tableRows}
				<tr class="font-semibold">
					<td class="py-1 text-gray-300">Total</td>
					<td></td>
					<td></td>
					<td class="py-1 text-green-400 text-right">$${Number(total).toFixed(2)}</td>
				</tr>
			</tbody>
		</table>
		<div class="mt-2 pt-2 border-t border-gray-600/50">
			<p class="text-gray-400 text-xs">Customer: <span class="text-gray-300">${orderData.customer || "John Doe"}</span></p>
			<p class="text-gray-400 text-xs">Distance: <span class="text-gray-300">${orderData.distance || 1} km</span></p>
		</div>
	`;

	const cardFooter = document.createElement("div");
	cardFooter.classList.add(
		"px-4",
		"py-2",
		"bg-gray-800/30",
		"rounded-b-lg",
		"border-t",
		"border-gray-600",
		"shrink-0",
	);

	const processBtn = document.createElement("button");
	processBtn.classList.add(
		"w-full",
		"py-1.5",
		"bg-gray-500",
		"text-white",
		"text-xs",
		"font-medium",
		"rounded",
		"cursor-not-allowed",
	);
	processBtn.innerText = "Verifying stock...";
	processBtn.disabled = true;

	const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
	const verifyDelay = 1000 + totalQuantity * getRandomInt(500, 1000);

	setTimeout(() => {
		processBtn.disabled = false;
		processBtn.innerText = "Process Order";
		processBtn.classList.remove("bg-gray-500", "cursor-not-allowed");
		processBtn.classList.add(
			"bg-indigo-600",
			"hover:bg-indigo-500",
			"transition-colors",
		);
		processBtn.addEventListener("click", () => {
			processIncomingOrder(orderNo, orderData);
		});
	}, verifyDelay);

	cardFooter.appendChild(processBtn);
	cardDiv.append(cardHeader, cardBody, cardFooter);
	container.appendChild(cardDiv);

	updateOrderCounts();
	return cardDiv;
}

function createProcessingOrderCard(orderData) {
	const container = document.getElementById("processing-orders");
	const orderNo = orderData.orderNo;
	const status = orderData.status || "picking";

	const cardDiv = document.createElement("div");
	cardDiv.classList.add(
		"bg-gray-700/50",
		"border",
		"border-gray-600",
		"rounded-lg",
		"shadow-lg",
		"flex",
		"flex-col",
		"hover:bg-gray-700",
		"transition-all",
		"duration-200",
		"h-80",
	);
	cardDiv.id = `processing-order-${orderNo}`;

	const cardHeader = document.createElement("div");
	cardHeader.classList.add(
		"flex",
		"items-center",
		"justify-between",
		"px-4",
		"py-3",
		"bg-gray-800/50",
		"rounded-t-lg",
		"border-b",
		"border-gray-600",
	);

	const orderTitle = document.createElement("span");
	orderTitle.classList.add("text-white", "font-semibold", "text-sm");
	orderTitle.innerText = `Order #${orderNo}`;

	const statusBadge = document.createElement("span");
	const statusInfo = orderStatuses[status];
	statusBadge.classList.add(
		"px-2",
		"py-1",
		statusInfo.bgClass,
		statusInfo.textClass,
		"text-xs",
		"rounded-full",
		"font-medium",
	);
	statusBadge.id = `order-status-badge-${orderNo}`;
	statusBadge.innerText = statusInfo.label;

	cardHeader.append(orderTitle, statusBadge);

	const cardBody = document.createElement("div");
	cardBody.classList.add(
		"px-4",
		"py-2",
		"flex-1",
		"overflow-y-auto",
		"min-h-0",
	);

	const items = orderData.items || [
		{ name: "Item 1", quantity: 1, price: 25.0 },
	];

	let tableRows = "";
	let total = 0;

	items.forEach((item, index) => {
		const itemTotal = item.quantity * item.price;
		total += itemTotal;
		tableRows += `
			<tr class="border-b border-gray-600/50">
				<td class="py-2 text-gray-400">${index + 1}</td>
				<td class="py-2 text-gray-300">${item.name}</td>
				<td class="py-2 text-gray-400 text-center">${item.quantity}</td>
				<td class="py-2 text-gray-300 text-right">$${Number(item.price).toFixed(2)}</td>
			</tr>
		`;
	});

	cardBody.innerHTML = `
		<table class="w-full text-xs">
			<thead>
				<tr class="border-b border-gray-600 text-gray-400">
					<th class="py-2 text-left font-medium">#</th>
					<th class="py-2 text-left font-medium">Item</th>
					<th class="py-2 text-center font-medium">Qty</th>
					<th class="py-2 text-right font-medium">Price</th>
				</tr>
			</thead>
			<tbody>
				${tableRows}
				<tr class="font-semibold">
					<td class="py-2 text-gray-300">Total</td>
					<td></td>
					<td></td>
					<td class="py-2 text-green-400 text-right">$${Number(total).toFixed(2)}</td>
				</tr>
			</tbody>
		</table>
	`;

	const cardFooter = document.createElement("div");
	cardFooter.classList.add(
		"flex",
		"items-center",
		"justify-between",
		"px-4",
		"py-2",
		"bg-gray-800/50",
		"rounded-b-lg",
		"border-t",
		"border-gray-600",
		"shrink-0",
		"mt-auto",
	);
	cardFooter.id = `order-footer-${orderNo}`;

	const footerInfo = document.createElement("div");
	footerInfo.classList.add("flex", "flex-col");

	const customerSpan = document.createElement("span");
	customerSpan.classList.add("text-gray-300", "text-xs", "font-medium");
	customerSpan.innerText = orderData.customer || "John Doe";

	const distanceSpan = document.createElement("span");
	distanceSpan.classList.add("text-gray-400", "text-xs");
	distanceSpan.id = `order-distance-${orderNo}`;
	distanceSpan.innerText = `${orderData.distance || 1} km away`;

	const timestamp = document.createElement("span");
	timestamp.classList.add("text-gray-500", "text-xs");
	const currentTime = new Date();
	timestamp.innerText = currentTime.toLocaleTimeString();

	footerInfo.append(customerSpan, distanceSpan, timestamp);

	const buttonContainer = document.createElement("div");
	buttonContainer.classList.add("flex", "gap-2");
	buttonContainer.id = `order-buttons-${orderNo}`;

	const cancelBtn = document.createElement("button");
	cancelBtn.classList.add(
		"py-1",
		"px-3",
		"bg-red-600/80",
		"hover:bg-red-500",
		"text-white",
		"text-xs",
		"font-medium",
		"rounded",
		"transition-colors",
	);
	cancelBtn.innerText = "Cancel";
	cancelBtn.addEventListener("click", () => {
		removeOrder(orderNo, "processing");
	});
	buttonContainer.appendChild(cancelBtn);

	cardFooter.append(footerInfo, buttonContainer);
	cardDiv.append(cardHeader, cardBody, cardFooter);

	container.prepend(cardDiv);
	startStageProgression(orderNo, orderData);

	updateOrderCounts();
	return cardDiv;
}

function createOrderCard(orderData, containerType) {
	if (containerType === "incoming") {
		return createIncomingOrderCard(orderData);
	} else {
		return createProcessingOrderCard(orderData);
	}
}

function processIncomingOrder(orderNo, orderData) {
	const incomingCard = document.getElementById(`incoming-order-${orderNo}`);
	if (incomingCard) {
		incomingCard.classList.add("opacity-0", "scale-95");
		setTimeout(() => {
			incomingCard.remove();
			updateOrderCounts();
		}, 200);
	}

	orderData.orderNo = orderNo;
	orderData.status = "picking";
	createOrderCard(orderData, "processing");
}

function startStageProgression(orderNo, orderData) {
	let currentStageIndex = 0;
	const itemCount = orderData.items ? orderData.items.length : 1;

	function progressToNextStage() {
		currentStageIndex++;

		if (Math.random() < 1 / 50) {
			updateOrderStatus(orderNo, "failed");
			addRestartButton(orderNo, orderData);
			return;
		}

		if (currentStageIndex < stageOrder.length) {
			const newStatus = stageOrder[currentStageIndex];
			updateOrderStatus(orderNo, newStatus);

			if (currentStageIndex < stageOrder.length - 1) {
				let delay;
				if (newStatus === "delivering") {
					const distance = orderData.distance || 1;
					const baseTime = distance * 1000;
					const variation = getRandomInt(-2000, 4000);
					delay = baseTime + variation;
					delay = Math.max(delay, 2000);
					startDistanceCountdown(orderNo, distance, delay);
				} else {
					delay = getRandomInt(3000, 15000);
				}
				setTimeout(progressToNextStage, delay);
			}
		}
	}

	const basePickingTime = 2000;
	const timePerItem = getRandomInt(1500, 2500);
	const pickingDelay = basePickingTime + timePerItem * itemCount;
	setTimeout(progressToNextStage, pickingDelay);
}

function startDistanceCountdown(orderNo, distance, totalTime) {
	const distanceSpan = document.getElementById(`order-distance-${orderNo}`);
	if (!distanceSpan) return;

	const startTime = Date.now();
	const startDistance = distance;

	const updateInterval = setInterval(() => {
		const elapsed = Date.now() - startTime;
		const progress = Math.min(elapsed / totalTime, 1);
		const currentDistance = startDistance * (1 - progress);

		if (currentDistance <= 0 || progress >= 1) {
			distanceSpan.innerText = "0 km away";
			clearInterval(updateInterval);
		} else {
			distanceSpan.innerText = `${currentDistance.toFixed(1)} km away`;
		}
	}, 100);
}

function addRestartButton(orderNo, orderData) {
	const buttonContainer = document.getElementById(`order-buttons-${orderNo}`);
	if (buttonContainer) {
		buttonContainer.innerHTML = "";

		const restartBtn = document.createElement("button");
		restartBtn.classList.add(
			"py-1",
			"px-3",
			"bg-amber-600",
			"hover:bg-amber-500",
			"text-white",
			"text-xs",
			"font-medium",
			"rounded",
			"transition-colors",
		);
		restartBtn.innerText = "Restart Order";
		restartBtn.addEventListener("click", () => {
			restartOrder(orderNo, orderData);
		});

		const dismissBtn = document.createElement("button");
		dismissBtn.classList.add(
			"py-1",
			"px-3",
			"bg-gray-600",
			"hover:bg-gray-500",
			"text-white",
			"text-xs",
			"font-medium",
			"rounded",
			"transition-colors",
		);
		dismissBtn.innerText = "Dismiss";
		dismissBtn.addEventListener("click", () => {
			removeOrder(orderNo, "processing");
		});

		buttonContainer.append(restartBtn, dismissBtn);
	}
}

function restartOrder(orderNo, orderData) {
	removeOrder(orderNo, "processing");

	setTimeout(() => {
		const newOrderData = {
			...orderData,
			orderNo: generateOrderNumber(),
			status: "picking",
		};
		createOrderCard(newOrderData, "processing");
	}, 300);
}

function removeOrder(orderNo, type) {
	const card = document.getElementById(`${type}-order-${orderNo}`);
	if (card) {
		card.classList.add("opacity-0", "scale-95");
		setTimeout(() => {
			card.remove();
			updateOrderCounts();
		}, 200);
	}
}

function updateOrderStatus(orderNo, newStatus) {
	const statusBadge = document.getElementById(`order-status-badge-${orderNo}`);
	if (statusBadge && orderStatuses[newStatus]) {
		const statusInfo = orderStatuses[newStatus];
		statusBadge.className = `px-2 py-1 ${statusInfo.bgClass} ${statusInfo.textClass} text-xs rounded-full font-medium`;
		statusBadge.innerText = statusInfo.label;
	}
}

function updateOrderCounts() {
	const incomingContainer = document.getElementById("incoming-orders");
	const processingContainer = document.getElementById("processing-orders");
	const incomingCount = document.getElementById("incoming-count");
	const processingCount = document.getElementById("processing-count");

	if (incomingContainer && incomingCount) {
		const count = incomingContainer.children.length;
		incomingCount.innerText = `${count} order${count !== 1 ? "s" : ""}`;
	}

	if (processingContainer && processingCount) {
		const count = processingContainer.children.length;
		processingCount.innerText = `${count} order${count !== 1 ? "s" : ""}`;
	}
}

function clearCompletedOrders() {
	const processingOrders = document.getElementById("processing-orders");
	const cards = processingOrders.querySelectorAll('[id^="processing-order-"]');

	let hasRemovals = false;
	cards.forEach((card) => {
		const statusBadge = card.querySelector('[id^="order-status-badge-"]');
		if (
			statusBadge &&
			(statusBadge.innerText === "Delivered" ||
				statusBadge.innerText === "Failed")
		) {
			hasRemovals = true;
			card.classList.add("opacity-0", "scale-95");
			setTimeout(() => card.remove(), 200);
		}
	});

	if (hasRemovals) {
		setTimeout(() => updateOrderCounts(), 250);
	}
}

function scheduleNextOrder() {
	if (!isReceivingOrders) return;

	const delay = getRandomInt(2000, 12000);

	orderGeneratorInterval = setTimeout(() => {
		if (isReceivingOrders) {
			const orderData = generateRandomOrder();
			createOrderCard(orderData, "incoming");
			scheduleNextOrder();
		}
	}, delay);
}

function startReceivingOrders() {
	const startButton = document.getElementById("start-button");

	if (isReceivingOrders) {
		isReceivingOrders = false;
		if (orderGeneratorInterval) {
			clearTimeout(orderGeneratorInterval);
			orderGeneratorInterval = null;
		}
		if (startButton) {
			startButton.innerText = "Start Receiving Orders";
			startButton.classList.remove("bg-red-600", "hover:bg-red-500");
			startButton.classList.add("bg-indigo-600", "hover:bg-indigo-500");
		}
	} else {
		isReceivingOrders = true;
		if (startButton) {
			startButton.innerText = "Stop Receiving Orders";
			startButton.classList.remove("bg-indigo-600", "hover:bg-indigo-500");
			startButton.classList.add("bg-red-600", "hover:bg-red-500");
		}
		const orderData = generateRandomOrder();
		createOrderCard(orderData, "incoming");
		scheduleNextOrder();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const startButton = document.getElementById("start-button");
	if (startButton) {
		startButton.addEventListener("click", startReceivingOrders);
	}

	const clearCompletedButton = document.getElementById(
		"clear-completed-button",
	);
	if (clearCompletedButton) {
		clearCompletedButton.addEventListener("click", clearCompletedOrders);
	}

	updateOrderCounts();

	const expandIncomingBtn = document.getElementById("expand-incoming-button");
	const expandProcessingBtn = document.getElementById(
		"expand-processing-button",
	);
	const incomingSection = document.getElementById("incoming-section");
	const processingSection = document.getElementById("processing-section");

	let incomingExpanded = false;
	let processingExpanded = false;

	if (expandIncomingBtn) {
		expandIncomingBtn.addEventListener("click", () => {
			if (incomingExpanded) {
				incomingSection.style.height = "400px";
				incomingSection.classList.remove("flex-1");
				processingSection.classList.remove("hidden");
				expandIncomingBtn.innerHTML = `
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
					</svg>
					Expand
				`;
				incomingExpanded = false;
			} else {
				incomingSection.style.height = "";
				incomingSection.classList.add("flex-1");
				processingSection.classList.add("hidden");
				expandIncomingBtn.innerHTML = `
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"/>
					</svg>
					Collapse
				`;
				incomingExpanded = true;
			}
		});
	}

	if (expandProcessingBtn) {
		expandProcessingBtn.addEventListener("click", () => {
			if (processingExpanded) {
				processingSection.classList.remove("flex-1");
				processingSection.classList.add("flex-1", "min-h-0");
				incomingSection.classList.remove("hidden");
				expandProcessingBtn.innerHTML = `
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
					</svg>
					Expand
				`;
				processingExpanded = false;
			} else {
				incomingSection.classList.add("hidden");
				expandProcessingBtn.innerHTML = `
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"/>
					</svg>
					Collapse
				`;
				processingExpanded = true;
			}
		});
	}
});
