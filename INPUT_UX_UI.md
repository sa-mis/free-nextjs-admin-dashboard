<div>
    <Label htmlFor="description">Description</Label>
    <textarea
    id="description"
    {...register('description')}
    rows={3}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
    placeholder="Enter description (optional)"
    />
</div>

<div className="flex items-center justify-between">
    <Label htmlFor="is_active">Active Status</Label>
    <Switch
    id="is_active"
    {...register('is_active')}
    defaultChecked={maintenanceType?.is_active ?? true}
    />
</div>

<div>
<Label htmlFor="status">Status</Label>
<select
    id="status"
    {...register('status')}
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
>
    <option value="draft">Draft</option>
    <option value="approved">Approved</option>
    <option value="scheduled">Scheduled</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
</select>
</div>
