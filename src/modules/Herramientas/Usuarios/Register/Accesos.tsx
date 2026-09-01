const Accesos = ({ form, setForm, catalogo }) => {
    const modules = catalogo.modules || [];
    const submodules = catalogo.submodules || [];
    const permissions = catalogo.permissions || [];

    const hasPermission = (moduleName, submoduleName, permissionName) => {
        return form.modules?.some((item) =>
            item.name === moduleName &&
            item.submodule?.name === submoduleName &&
            item.submodule?.permissions?.includes(permissionName)
        );
    }

    const togglePermission = (moduleData, submoduleData, permissionName) => {
        setForm((prev) => {
            const modulesForm = [...(prev.modules || [])];
            const index = modulesForm.findIndex((item) =>
                item.name === moduleData.name && item.submodule?.name === submoduleData.name
            );

            if (index === -1) {
                return {
                    ...prev,
                    modules: [
                        ...modulesForm,
                        {
                            name: moduleData.name,
                            moduleId: moduleData._id,
                            submodule: {
                                name: submoduleData.name,
                                submoduleId: submoduleData._id,
                                permissions: [permissionName],
                            },
                        },
                    ],
                };
            }

            const current = modulesForm[index];
            const currentPermissions = current.submodule?.permissions || [];
            const nextPermissions = currentPermissions.includes(permissionName)
                ? currentPermissions.filter((permission) => permission !== permissionName)
                : [...currentPermissions, permissionName];

            if (nextPermissions.length === 0) {
                modulesForm.splice(index, 1);
            } else {
                modulesForm[index] = {
                    ...current,
                    moduleId: moduleData._id,
                    submodule: {
                        ...current.submodule,
                        submoduleId: submoduleData._id,
                        permissions: nextPermissions,
                    },
                };
            }

            return { ...prev, modules: modulesForm };
        });
    }

    return (
        <div className="flex flex-col gap-5">
            {modules.map((moduleData) => {
                const moduleSubmodules = submodules.filter((submodule) => submodule.module === moduleData.name);
                return (
                    <div key={moduleData._id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
                        <span className="text-xl font-semibold text-sky-700">{moduleData.name}</span>
                        <div className="mt-4 flex flex-col gap-4">
                            {moduleSubmodules.map((submoduleData) => (
                                <div key={submoduleData._id} className="border-t border-gray-100 pt-3">
                                    <span className="font-semibold text-gray-700">{submoduleData.name}</span>
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {permissions.map((permission) => (
                                            <label key={`${submoduleData._id}-${permission._id}`} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 shadow-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={hasPermission(moduleData.name, submoduleData.name, permission.name)}
                                                    onChange={() => togglePermission(moduleData, submoduleData, permission.name)}
                                                />
                                                <span className="text-sm font-medium text-gray-700">{permission.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Accesos;
