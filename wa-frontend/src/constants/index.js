import GroupAddIcon from '@mui/icons-material/GroupAdd';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import InsightsIcon from '@mui/icons-material/Insights';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
export const DRAWER_ROUTES = [
    {
        title: 'User Management',
        icon: <GroupAddIcon />,
        url: '/users'
    },
    {
        title: 'Warehouse Management',
        icon: <WarehouseIcon />,
        url: '/'
    
    },
    {
        title: 'Analytics',
        icon: <InsightsIcon />,
        url: '/analytics'
    },
    {
        title: 'Items Management',
        icon: <AddShoppingCartIcon />,
        url: '/items'
    },
    {
        title: 'Categories Management',
        icon: <CategoryIcon />,
        url: '/categories'
    },
    {
        title: 'Subcategories Management',
        icon: <AutoAwesomeMotionIcon />,
        url: '/sub-categories'
    }
]