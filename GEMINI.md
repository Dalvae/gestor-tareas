# Chakra UI Component Usage

## Field Component

The `Field` component in this project's Chakra UI setup is a custom component located at `frontend/src/components/ui/field.tsx`. It is designed to simplify form field creation by encapsulating `Field.Label`, `Field.RequiredIndicator`, `Field.HelperText`, and `Field.ErrorText`.

**Correct Usage:**
Pass the `label`, `helperText`, `errorText`, and `optionalText` as props directly to the `Field` component. The input element (e.g., `Input`, `Textarea`) should be rendered as a child of the `Field` component.

```tsx
<Field required label="Title" errorText={errors.title?.message}>
  <Input
    type="text"
    {...register("title", { required: "Title is required" })}
    placeholder="Task title"
  />
</Field>
```

**Incorrect Usage (previously attempted):**
Do NOT use `Field.Label` or other sub-components as direct children of `Field`.

```tsx
<Field required>
  <Field.Label>Title</Field.Label> // Incorrect
  <Input
    type="text"
    {...register("title", { required: "Title is required" })}
    placeholder="Task title"
  />
</Field>
```

## Menu Components

The project uses custom `Menu` components located at `frontend/src/components/ui/menu.tsx`, which wrap Chakra UI's `Menu` components.

**Key Components and Usage:**

*   **`MenuRoot`**: The main container for the menu.
*   **`MenuTrigger`**: The component that triggers the menu to open/close. It should typically wrap an `IconButton` or `Button` with `asChild`.
*   **`MenuContent`**: The container for the menu items.
*   **`MenuItem`**: A selectable item within the menu. It requires a `value` prop and can contain text and icons.

**Integrating Dialogs (e.g., EditTask, DeleteTask) with Menus:**

Dialog components like `EditTask` and `DeleteTask` should manage their own `isOpen` state internally and contain their own `DialogTrigger`. The `MenuItem` in the `TaskActionsMenu` should act as the trigger for these dialogs via its `onClick` event.

**Correct Pattern:**

1.  **Dialog Component (`EditTask.tsx`, `DeleteTask.tsx`):**
    *   Manages its own `isOpen` state using `useState`.
    *   Renders a `DialogRoot` with `open` and `onOpenChange` props tied to its internal state.
    *   Contains its own `DialogTrigger` (e.g., a `MenuItem` or `Button`) that, when clicked, sets `isOpen` to `true`.

    ```tsx
    // Inside EditTask.tsx or DeleteTask.tsx
    const [isOpen, setIsOpen] = useState(false);

    return (
      <DialogRoot open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
        <DialogTrigger asChild>
          <MenuItem onClick={() => setIsOpen(true)} value="unique-value">
            <FiEdit fontSize="16px" />
            Edit Task
          </MenuItem>
        </DialogTrigger>
        {/* ... DialogContent and form ... */}
      </DialogRoot>
    );
    ```

2.  **Menu Component (`TaskActionsMenu.tsx`):**
    *   Renders `EditTask` and `DeleteTask` directly inside `MenuContent`.
    *   Does NOT manage the `isOpen` state for `EditTask` or `DeleteTask`.
    *   Does NOT pass `children` to `EditTask` or `DeleteTask` for their triggers.

    ```tsx
    // Inside TaskActionsMenu.tsx
    return (
      <MenuRoot>
        <MenuTrigger asChild>
          <IconButton variant="ghost" color="inherit" aria-label="More options">
            <BsThreeDotsVertical />
          </IconButton>
        </MenuTrigger>
        <MenuContent>
          <EditTask task={task} />
          <DeleteTask id={task.id} />
        </MenuContent>
      </MenuRoot>
    );
    ```

## Task Views (List and Calendar)

The `/tasks` route now supports two views: a list view and a calendar view. Users can switch between these views using buttons.

*   **`TasksTable`**: The existing component for displaying tasks in a table format.
*   **`TaskCalendar`**: A component for displaying tasks in a calendar format, implemented using `react-big-calendar`.

**Implementation Details:**

*   The `Tasks` component in `frontend/src/routes/_layout/tasks.tsx` manages the `view` state.
*   Buttons with `FaList` and `FaCalendarAlt` icons are used to toggle between the `list` and `calendar` views.
*   The `TaskCalendar` component now fetches tasks using `useQuery`, formats them for `react-big-calendar`, and displays them in the "agenda" view by default. It also handles the case where no tasks are available.
