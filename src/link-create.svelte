<div class="flex flex-col gap-3">
  <h1 class="mt-4 mb-2 text-3xl font-bold">Add your link:</h1>
  <div class="form-control w-full max-w-xs">
    <input type="text" placeholder="URL" class="input input-bordered w-full max-w-xs" />
  </div>
  <div class="form-control w-full max-w-xs">
    <select class="select select-bordered w-full max-w-xs">
      <option disabled selected>Priority</option>
      <option>High</option>
      <option>Medium</option>
      <option>Low</option>
    </select>
  </div>
  <div class="form-control max-w-xs">
    <label class="label cursor-pointer justify-start gap-3">
      <input type="checkbox" checked="checked" class="checkbox" />
      <span class="label-text">Is favorite?</span>
    </label>
  </div>
  <button type="submit" class="btn btn-primary max-w-xs">Add</button>
</div>
