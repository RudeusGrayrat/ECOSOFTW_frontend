import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const useModulesAndSubModules = () => {
    const { user } = useAuth();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            setLoading(true);
            try {
                const modules = user ? user.modules : [];

                const grouped = modules.reduce((acc, mo) => {
                    let moduleEntry = acc.find((entry) => entry.module === mo.name);
                    if (!moduleEntry) {
                        moduleEntry = { module: mo.name, submodule: [] };
                        acc.push(moduleEntry);
                    }
                    if (mo.submodule && mo.submodule.name) {
                        moduleEntry.submodule.push(mo.submodule.name);
                    }
                    return acc;
                }, []);

                setLinks(grouped);
            } catch (error) {
                console.error("Error fetching modules:", error);
                throw error;
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, [user]);

    return { links, loading };
};

export default useModulesAndSubModules;
