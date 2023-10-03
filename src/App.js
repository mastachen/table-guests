import { useState } from "react";

const initialTables = [
  {
    id: "1",
    name: "Fun Table",
    size: 6,
  },
  {
    id: "2",
    name: "Grumpy Table",
    size: 4,
  },
  {
    id: "3",
    name: "Family Table",
    size: 8,
  },
];

const initialGuests = [
  //first table
  {
    id: 1,
    tableId: "1",
    name: "Ana Banana",
    avatar: "https://i.pravatar.cc/48?u=1",
  },
  {
    id: 2,
    tableId: "1",
    name: "Bine Bambine",
    avatar: "https://i.pravatar.cc/48?u=2",
  },
  {
    id: 3,
    tableId: "1",
    name: "Cene Cenik",
    avatar: "https://i.pravatar.cc/48?u=3",
  },
  //second table
  {
    id: 4,
    tableId: "2",
    name: "Črt Črtomir",
    avatar: "https://i.pravatar.cc/48?u=4",
  },
  {
    id: 5,
    tableId: "2",
    name: "Danilo Danilovič",
    avatar: "https://i.pravatar.cc/48?u=5",
  },
  //third table
  {
    id: 6,
    tableId: "3",
    name: "Eva Evič",
    avatar: "https://i.pravatar.cc/48?u=6",
  },
  {
    id: 7,
    tableId: "3",
    name: "Franc Frančič",
    avatar: "https://i.pravatar.cc/48?u=7",
  },
  {
    id: 8,
    tableId: "3",
    name: "Gregor Gregorčič",
    avatar: "https://i.pravatar.cc/48?u=8",
  },
  {
    id: 9,
    tableId: "3",
    name: "Hana Hanič",
    avatar: "https://i.pravatar.cc/48?u=9",
  },
];

export default function App() {
  const [tables, setTables] = useState(initialTables);
  const [guests, setGuests] = useState(initialGuests);

  const [showTableForm, setShowTableForm] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);

  function toggleShowTableForm() {
    setShowTableForm((show) => !show);
    setShowGuestForm(false);
  }

  function toggleShowGuestForm() {
    setShowGuestForm((show) => !show);
    setShowTableForm(false);
  }

  function closeShowTableForm() {
    setShowTableForm(false);
  }

  function closeShowGuestForm() {
    setShowGuestForm(false);
  }

  function onAddTable(table) {
    setTables((tables) => [...tables, table]);
  }

  function onAddGuest(guest) {
    setGuests((guests) => [...guests, guest]);
  }

  function handleDeleteGuest(id) {
    setGuests((guests) => guests.filter((guest) => guest.id !== id));
  }

  return (
    <div className="app">
      <div className="sidebar">
        <button className="button" onClick={toggleShowTableForm}>
          New table
        </button>
        <button className="button" onClick={toggleShowGuestForm}>
          New guest
        </button>
        {showTableForm && (
          <FormAddTable
            onClose={closeShowTableForm}
            onAddTable={onAddTable}
          ></FormAddTable>
        )}
        {showGuestForm && (
          <FormAddGuest
            tables={tables}
            guests={guests}
            onClose={closeShowGuestForm}
            onAddGuest={onAddGuest}
          ></FormAddGuest>
        )}
      </div>
      <div className="main">
        <TableList
          tables={tables}
          guests={guests}
          onDeleteGuest={handleDeleteGuest}
        ></TableList>
      </div>
    </div>
  );
}

function FormAddTable({ onClose, onAddTable }) {
  const [name, setName] = useState("");
  const [size, setSize] = useState(2);

  function handleClose(e) {
    e.preventDefault();
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !size || size === 0) return;

    const id = crypto.randomUUID();
    const newTable = {
      id,
      name,
      size: Number(size),
    };

    onAddTable(newTable);

    setName("");
    setSize("");
  }

  return (
    <form className="form-add-table" onSubmit={handleSubmit}>
      <h3>New table</h3>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>Size</label>
      <input
        type="number"
        value={Number(size)}
        min="2"
        onChange={(e) => setSize(Number(e.target.value))}
      ></input>
      <button className="button">Add</button>
      <button className="button" onClick={handleClose}>
        Close
      </button>
    </form>
  );
}

function FormAddGuest({ tables, guests, onClose, onAddGuest }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/48");
  const [tableId, setTableId] = useState(tables[0].id);

  function handleClose(e) {
    e.preventDefault();
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !avatar) return;

    const id = crypto.randomUUID();
    const newGuest = {
      id,
      avatar,
      name,
      tableId,
    };

    onAddGuest(newGuest);

    setName("");
    setAvatar("https://i.pravatar.cc/48");
    setTableId(tables[0].id);
  }

  return (
    <form className="form-add-guest" onSubmit={handleSubmit}>
      <h3>New guest</h3>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>Avatar</label>
      <input
        type="text"
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
      ></input>
      <label>Table</label>
      <select value={tableId} onChange={(e) => setTableId(e.target.value)}>
        {tables.map((table) => (
          <option
            disabled={
              table.size -
                guests.filter((g) => g.tableId === table.id).length ===
              0
            }
            key={table.id}
            value={table.id}
          >
            {table.name}
          </option>
        ))}
      </select>
      <button className="button">Add</button>
      <button className="button" onClick={handleClose}>
        Close
      </button>
    </form>
  );
}

function TableList({ tables, guests, onDeleteGuest }) {
  return (
    <div className="table-list">
      {tables.map((table) => (
        <Table
          key={table.id}
          table={table}
          guests={guests.filter((guest) => guest.tableId === table.id)}
          onDeleteGuest={onDeleteGuest}
        ></Table>
      ))}
    </div>
  );
}

function Table({ table, guests, onDeleteGuest }) {
  const availableSeats = table.size - guests.length;

  return (
    <div className="table">
      <h2>{table.name}</h2>
      <ul>
        {guests.map((guest) => (
          <Guest key={guest.id} guest={guest} onDelete={onDeleteGuest}></Guest>
        ))}
      </ul>
      <label>Available seats: {availableSeats}</label>
    </div>
  );
}

function Guest({ guest, onDelete }) {
  return (
    <li>
      <img src={guest.avatar} alt={guest.name}></img>
      <h3>{guest.name}</h3>
      <button className="button-icon" onClick={() => onDelete(guest.id)}>
        ❌
      </button>
    </li>
  );
}
