import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import SortableTree, { type TreeItem } from "@nosferatu500/react-sortable-tree";
import SettingsIcon from "@mui/icons-material/Settings";
import FolderIcon from "@mui/icons-material/Folder";
import SyncIcon from "@mui/icons-material/Sync";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "@nosferatu500/react-sortable-tree/style.css";
import { MachineService, type Machine } from "../../services/api";

const initialTree: TreeItem[] = [];
type ApiNode = TreeItem & { machineId?: number; custom?: boolean; sn?: string };
type ExtrasStore = { root: ApiNode[]; byMachineId: Record<number, ApiNode[]> };

export default function AssetsTree() {
  const [treeData, setTreeData] = useState<TreeItem[]>(initialTree);
  const STORAGE_EXTRAS = "assets_tree_extras_v1";
  const STORAGE_RENAMES = "assets_tree_renames_v1";
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuPath, setMenuPath] = useState<number[] | null>(null);
  const [menuIsRoot, setMenuIsRoot] = useState(false);

  const loadExtras = (): ExtrasStore => {
    try {
      const raw = localStorage.getItem(STORAGE_EXTRAS);
      if (!raw) return { root: [], byMachineId: {} };
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return { root: parsed as ApiNode[], byMachineId: {} };
      }
      return parsed as ExtrasStore;
    } catch {
      return { root: [], byMachineId: {} };
    }
  };

  const saveExtras = (extras: ExtrasStore) => {
    try {
      localStorage.setItem(STORAGE_EXTRAS, JSON.stringify(extras));
    } catch {
      void 0;
    }
  };

  const loadRenames = (): Record<number, string> => {
    try {
      const raw = localStorage.getItem(STORAGE_RENAMES);
      return raw ? (JSON.parse(raw) as Record<number, string>) : {};
    } catch {
      return {};
    }
  };

  const saveRenames = (map: Record<number, string>) => {
    try {
      localStorage.setItem(STORAGE_RENAMES, JSON.stringify(map));
    } catch (e) {
      console.error("Error saving renames:", e);
    }
  };

  const buildTreeFrom = (
    machines: Machine[],
    extras: ExtrasStore,
    renames: Record<number, string>
  ): TreeItem[] => {
    // Garante que as máquinas estejam sempre na ordem correta
    const sortedMachines = [...machines].sort((a, b) => a.id - b.id);
    
    const children: ApiNode[] = sortedMachines.map((m) => ({
      machineId: m.id,
      title: renames[m.id] ?? m.name, // Usa o nome renomeado se existir, senão usa o nome original
      sn: m.serialNumber,
      children: extras.byMachineId[m.id] ?? [],
    }));
    
    const root: ApiNode = {
      title: "Máquinas",
      expanded: true,
      children: [...children, ...(extras.root ?? [])],
    };
    
    return [root];
  };


  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, path: number[]) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuPath(path);
    setMenuIsRoot(path.length === 1);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuPath(null);
    setMenuIsRoot(false);
  };

  const handleRename = async () => {
    if (!menuPath) return;
    
    const node = getNodeAtPath(treeData, menuPath);
    if (!node) return;
    
    const currentName = node.title as string;
    const typed = window.prompt("Novo nome", currentName);
    if (typed === null) return; // Usuário cancelou
    
    const newTitle = typed.trim();
    if (!newTitle || newTitle === currentName) return; // Nada mudou
    
    // Se for uma máquina real, atualiza no servidor
    if (node.machineId) {
      try {
        await MachineService.update(node.machineId, { name: newTitle });
        // Limpa qualquer renomeação local para este nó
        const renames = loadRenames();
        if (renames[node.machineId]) {
          delete renames[node.machineId];
          saveRenames(renames);
        }
      } catch (error) {
        console.error("Erro ao renomear máquina:", error);
        alert(`Erro ao renomear: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        return;
      }
    } 
    // Se for um nó personalizado, salva localmente
    else if (node.custom) {
      const extras = loadExtras();
      const path = menuPath;
      
      // Nó raiz personalizado
      if (path.length === 1) {
        // Não permitir renomear o nó raiz principal
        return;
      }
      
      // Nó personalizado no nível raiz
      if (path.length === 2) {
        const idx = (extras.root ?? []).findIndex(n => n.title === currentName);
        if (idx >= 0) {
          extras.root = [...(extras.root || [])];
          extras.root[idx] = { ...extras.root[idx], title: newTitle };
          saveExtras(extras);
        }
      } 
      // Nó personalizado dentro de uma máquina
      else if (path.length > 2) {
        const parentPath = path.slice(0, -1);
        const parentNode = getNodeAtPath(treeData, parentPath);
        
        if (parentNode?.machineId) {
          const machineId = parentNode.machineId;
          const children = extras.byMachineId[machineId] || [];
          const idx = children.findIndex(n => n.title === currentName);
          
          if (idx >= 0) {
            extras.byMachineId[machineId] = [...children];
            extras.byMachineId[machineId][idx] = { 
              ...extras.byMachineId[machineId][idx], 
              title: newTitle 
            };
            saveExtras(extras);
          }
        }
      }
    }
    
    // Atualiza a árvore para refletir as mudanças
    await syncFromApi();
    handleCloseMenu();
  };

  // Função auxiliar para encontrar um nó pelo caminho
  const getNodeAtPath = (tree: TreeItem[], path: number[]): ApiNode | null => {
    let current: { children?: TreeItem[] } = { children: [...tree] };
    
    for (let i = 0; i < path.length; i++) {
      const index = path[i];
      if (!current.children || !Array.isArray(current.children) || index >= current.children.length) {
        return null;
      }
      
      const nextNode = current.children[index];
      if (i === path.length - 1) {
        return nextNode as ApiNode;
      }
      
      current = nextNode as { children?: TreeItem[] };
    }
    
    return null;
  };

  // Sincroniza a árvore com a API e com os dados locais
  const syncFromApi = useCallback(async () => {
    try {
      const machines = await MachineService.getAll();
      const extras = loadExtras();
      const renames = loadRenames();
      
      // Atualiza os nomes das máquinas que foram renomeadas localmente
      // mas ainda não foram atualizadas na API
      const updatedMachines = await Promise.all(
        machines.map(async (machine) => {
          if (renames[machine.id]) {
            try {
              // Tenta atualizar o nome no servidor
              const updated = await MachineService.update(machine.id, { 
                name: renames[machine.id] 
              });
              
              // Remove do registro de renomeações locais se a atualização for bem-sucedida
              delete renames[machine.id];
              saveRenames(renames);
              
              return updated;
            } catch (error) {
              console.error(`Erro ao sincronizar renomeação da máquina ${machine.id}:`, error);
              return machine; // Mantém a máquina original em caso de erro
            }
          }
          return machine;
        })
      );
      
      const built = buildTreeFrom(updatedMachines, extras, renames);
      setTreeData(built);
    } catch (error) {
      console.error("Falha ao sincronizar a árvore:", error);
      setTreeData([]);
    }
  }, []);

  // Carrega os dados iniciais
  useEffect(() => {
    let active = true;
    
    const loadData = async () => {
      try {
        const machines = await MachineService.getAll();
        if (!active) return;
        
        const extras = loadExtras();
        const renames = loadRenames();
        const built = buildTreeFrom(machines, extras, renames);
        
        setTreeData(built);
      } catch (error) {
        console.error("Erro ao carregar máquinas:", error);
        setTreeData([]);
      }
    };
    
    loadData();
    
    // Configura a sincronização periódica a cada 30 segundos
    const syncInterval = setInterval(syncFromApi, 30000);
    
    return () => {
      active = false;
      clearInterval(syncInterval);
    };
  }, [syncFromApi]);

  const handleChange = (data: TreeItem[]) => {
    setTreeData(data);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Árvore de Ativos</Typography>
        <Button variant="outlined" startIcon={<SyncIcon />} onClick={syncFromApi}>
          Sincronizar
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <div style={{ height: 500 }}>
          <DndProvider backend={HTML5Backend}>
            <SortableTree
              treeData={treeData}
              onChange={handleChange}
              generateNodeProps={({ node, path }) => {
                const Bar = (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      pr: 1,
                      borderRadius: 1,
                      bgcolor: "#e6f2ff",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5, pl: 1 }}>
                      <FolderIcon fontSize="small" color="action" />
                      <Tooltip
                        title={
                          (node as unknown as ApiNode).sn
                            ? `SN: ${(node as unknown as ApiNode).sn}`
                            : ""
                        }
                        placement="top"
                        arrow
                      >
                        <Typography
                          component="span"
                          fontWeight={600}
                          sx={{ cursor: (node as unknown as ApiNode).sn ? "help" : "default" }}
                        >
                          {String(node.title)}
                        </Typography>
                      </Tooltip>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Tooltip title="Configurações">
                        <IconButton
                          size="small"
                          color="default"
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => handleOpenMenu(e, path as number[])}
                        >
                          <SettingsIcon fontSize="inherit" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                );
                return { title: Bar, subtitle: undefined };
              }}
            />
          </DndProvider>
        </div>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleCloseMenu}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {menuIsRoot && (
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                syncFromApi();
              }}
            >
              <SyncIcon fontSize="small" style={{ marginRight: 8 }} /> Sincronizar da API
            </MenuItem>
          )}
          {menuIsRoot && <Divider />}
          <MenuItem onClick={handleRename}>Renomear</MenuItem>
        </Menu>
      </Paper>
    </Box>
  );
}
