import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.create((req.body))
    if (!todo) throw Error()
    return res.status(201).json(todo)
  } catch (error) {
    // 🔥 THIS is the key fix
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: { message: error.message }
      });
    }
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    let { page = 1, limit = 10, completed, priority, search } = req.query

    page = parseInt(page)
    limit = parseInt(limit)

    const filter = {};

    // ✅ Filter: completed
    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    // ✅ Filter: priority
    if (priority) {
      filter.priority = priority;
    }

    // ✅ Filter: search (title)
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Todo.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Todo.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limit);

    return res.status(200).send(
      {
        data,
        meta: {
          total,
          page,
          limit,
          pages
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here
    const { id } = req.params
    const todo = await Todo.findById(id)
    if (!todo) {
      res.status(404).json({ error: { message: "Todo not found" } })
    }
    return res.status(200).json(todo)
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,        // return updated doc
        runValidators: true
      }
    );

    if (!todo) {
      return res.status(404).json({
        error: { message: "Todo not found" }
      });
    }

    return res.status(200).json(todo);

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: { message: error.message }
      });
    }
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        error: { message: "Todo not found" }
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.status(200).json(todo);

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    const { id } = req.params;

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({
        error: { message: "Todo not found" }
      });
    }

    return res.status(204).send(); // no content

  } catch (error) {
    next(error);
  }
}
