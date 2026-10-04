let currentStructure = "array";

let data = {
    array: [10, 20, 30, 40],
    stack: [10, 20, 30],
    queue: [10, 20, 30],
    linkedlist: [10, 20, 30]
};

let operationCount = 0;
let structuresUsed = new Set(["array"]);

let history = JSON.parse(
    localStorage.getItem("dsaVisualizerHistory")
) || [];

const structureButtons =
    document.querySelectorAll(".structure-btn");

const visualArea =
    document.getElementById("visualArea");

const valueInput =
    document.getElementById("valueInput");

const primaryBtn =
    document.getElementById("primaryBtn");

const secondaryBtn =
    document.getElementById("secondaryBtn");

const searchBtn =
    document.getElementById("searchBtn");

const sortBtn =
    document.getElementById("sortBtn");

const clearBtn =
    document.getElementById("clearBtn");

const resetBtn =
    document.getElementById("resetBtn");

const messageBox =
    document.getElementById("messageBox");

const structureLabel =
    document.getElementById("structureLabel");

const structureTitle =
    document.getElementById("structureTitle");

const descriptionTitle =
    document.getElementById("descriptionTitle");

const structureDescription =
    document.getElementById("structureDescription");

const operationCountElement =
    document.getElementById("operationCount");

const elementCountElement =
    document.getElementById("elementCount");

const structureCountElement =
    document.getElementById("structureCount");

const historyContainer =
    document.getElementById("historyContainer");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");


const descriptions = {

    array: {
        label: "ARRAY",
        title: "Array Visualizer",
        description:
            "An ordered collection where each element is accessed using an index."
    },

    stack: {
        label: "STACK",
        title: "Stack Visualizer",
        description:
            "A LIFO structure where the last element added is the first one removed."
    },

    queue: {
        label: "QUEUE",
        title: "Queue Visualizer",
        description:
            "A FIFO structure where the first element added is the first one removed."
    },

    linkedlist: {
        label: "LINKED LIST",
        title: "Linked List Visualizer",
        description:
            "A collection of nodes where each node connects to the next node."
    }

};


function updateStructureInfo() {

    const info = descriptions[currentStructure];

    structureLabel.textContent = info.label;
    structureTitle.textContent = info.title;
    descriptionTitle.textContent =
        info.label;

    structureDescription.textContent =
        info.description;

}


function render() {

    visualArea.innerHTML = "";

    const currentData = data[currentStructure];

    if (currentData.length === 0) {

        visualArea.innerHTML =
            `<div class="empty-structure">
                No elements available.
                Add an element to begin.
            </div>`;

        updateStats();
        return;
    }


    if (currentStructure === "array") {

        const container =
            document.createElement("div");

        container.className =
            "array-container";

        currentData.forEach((value, index) => {

            const item =
                document.createElement("div");

            item.className =
                "array-item";

            item.innerHTML = `
                ${escapeHTML(value)}
                <span class="array-index">
                    ${index}
                </span>
            `;

            container.appendChild(item);

        });

        visualArea.appendChild(container);
    }


    if (currentStructure === "stack") {

        const container =
            document.createElement("div");

        container.className =
            "stack-container";

        currentData.forEach(value => {

            const item =
                document.createElement("div");

            item.className =
                "stack-item";

            item.textContent = value;

            container.appendChild(item);

        });

        visualArea.appendChild(container);
    }


    if (currentStructure === "queue") {

        const container =
            document.createElement("div");

        container.className =
            "queue-container";

        const front =
            document.createElement("span");

        front.className =
            "queue-label";

        front.textContent = "FRONT";

        container.appendChild(front);

        currentData.forEach(value => {

            const item =
                document.createElement("div");

            item.className =
                "queue-item";

            item.textContent = value;

            container.appendChild(item);

        });

        const rear =
            document.createElement("span");

        rear.className =
            "queue-label";

        rear.textContent = "REAR";

        container.appendChild(rear);

        visualArea.appendChild(container);
    }


    if (currentStructure === "linkedlist") {

        const container =
            document.createElement("div");

        container.className =
            "linked-list-container";

        currentData.forEach((value, index) => {

            const node =
                document.createElement("div");

            node.className =
                "node";

            node.innerHTML = `
                <div class="node-box">
                    <div class="node-data">
                        ${escapeHTML(value)}
                    </div>
                    <div class="node-next">
                        NEXT
                    </div>
                </div>
                ${
                    index < currentData.length - 1
                    ? '<div class="arrow">→</div>'
                    : '<div class="arrow">→</div><span class="null-node">NULL</span>'
                }
            `;

            container.appendChild(node);

        });

        visualArea.appendChild(container);
    }

    updateStats();
}


function addElement() {

    const value =
        valueInput.value.trim();

    if (!value) {

        showMessage(
            "Please enter a value first."
        );

        return;
    }

    if (currentStructure === "queue") {

        data.queue.push(value);

        recordOperation(
            `Enqueued "${value}"`
        );

    } else {

        data[currentStructure].push(value);

        recordOperation(
            `Added "${value}"`
        );
    }

    valueInput.value = "";

    showMessage(
        `"${value}" added successfully.`
    );

    render();
}


function removeElement() {

    let removed;

    if (data[currentStructure].length === 0) {

        showMessage(
            "There are no elements to remove."
        );

        return;
    }


    if (currentStructure === "queue") {

        removed =
            data.queue.shift();

        recordOperation(
            `Dequeued "${removed}"`
        );

    } else {

        removed =
            data[currentStructure].pop();

        recordOperation(
            `Removed "${removed}"`
        );
    }


    showMessage(
        `"${removed}" removed successfully.`
    );

    render();
}


function searchElement() {

    const value =
        valueInput.value.trim();

    if (!value) {

        showMessage(
            "Enter a value to search."
        );

        return;
    }

    const index =
        data[currentStructure]
            .map(String)
            .indexOf(String(value));


    if (index !== -1) {

        showMessage(
            `"${value}" found at position ${index}.`
        );

        recordOperation(
            `Searched "${value}" — Found`
        );

    } else {

        showMessage(
            `"${value}" was not found.`
        );

        recordOperation(
            `Searched "${value}" — Not Found`
        );
    }

    valueInput.value = "";
}


function sortElements() {

    if (data[currentStructure].length < 2) {

        showMessage(
            "Add at least two elements to sort."
        );

        return;
    }

    data[currentStructure].sort(
        (a, b) => {

            const numA = Number(a);
            const numB = Number(b);

            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }

            return String(a).localeCompare(
                String(b)
            );
        }
    );

    recordOperation(
        `Sorted ${currentStructure}`
    );

    showMessage(
        "Elements sorted successfully."
    );

    render();
}


function clearStructure() {

    data[currentStructure] = [];

    recordOperation(
        `Cleared ${currentStructure}`
    );

    showMessage(
        `${currentStructure} cleared.`
    );

    render();
}


function resetStructure() {

    if (currentStructure === "array") {
        data.array = [10, 20, 30, 40];
    }

    if (currentStructure === "stack") {
        data.stack = [10, 20, 30];
    }

    if (currentStructure === "queue") {
        data.queue = [10, 20, 30];
    }

    if (currentStructure === "linkedlist") {
        data.linkedlist = [10, 20, 30];
    }

    recordOperation(
        `Reset ${currentStructure}`
    );

    showMessage(
        `${currentStructure} reset to default.`
    );

    render();
}


function switchStructure(structure) {

    currentStructure =
        structure;

    structuresUsed.add(structure);

    structureButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.structure === structure
        );

    });

    updateStructureInfo();

    showMessage(
        `Switched to ${structure}.`
    );

    render();
}


function recordOperation(operation) {

    operationCount++;

    history.unshift({
        structure: currentStructure,
        operation: operation,
        time: new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )
    });

    history =
        history.slice(0, 15);

    localStorage.setItem(
        "dsaVisualizerHistory",
        JSON.stringify(history)
    );

    updateStats();
    renderHistory();
}


function renderHistory() {

    if (history.length === 0) {

        historyContainer.innerHTML =
            `<div class="history-empty">
                No operations yet.
            </div>`;

        return;
    }

    historyContainer.innerHTML =
        history.map(item => {

            return `
                <div class="history-item">

                    <div>
                        <strong>
                            ${escapeHTML(item.operation)}
                        </strong>

                        <span>
                            ${escapeHTML(item.structure)}
                        </span>
                    </div>

                    <span>
                        ${escapeHTML(item.time)}
                    </span>

                </div>
            `;

        }).join("");
}


function updateStats() {

    operationCountElement.textContent =
        operationCount;

    elementCountElement.textContent =
        data[currentStructure].length;

    structureCountElement.textContent =
        structuresUsed.size;
}


function showMessage(message) {

    messageBox.textContent =
        message;
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


structureButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            switchStructure(
                button.dataset.structure
            );

        }
    );

});


primaryBtn.addEventListener(
    "click",
    addElement
);

secondaryBtn.addEventListener(
    "click",
    removeElement
);

searchBtn.addEventListener(
    "click",
    searchElement
);

sortBtn.addEventListener(
    "click",
    sortElements
);

clearBtn.addEventListener(
    "click",
    clearStructure
);

resetBtn.addEventListener(
    "click",
    resetStructure
);


valueInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            addElement();
        }

    }
);


clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        localStorage.removeItem(
            "dsaVisualizerHistory"
        );

        renderHistory();

        showMessage(
            "Operation history cleared."
        );

    }
);


updateStructureInfo();
render();
renderHistory();