import React, { useContext } from "react";
import { Layout as AntLayout, Menu } from "antd";
import {
    DashboardOutlined,
    LogoutOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { Link, useHistory } from "react-router-dom";
import humanizeString from "humanize-string";

import { AuthContext } from "@contexts/auth";
import { ResourceContext, IResourceContext } from "@contexts/resource";
import { IAuthContext } from "@interfaces";

export const Layout: React.FC = ({ children }) => {
    const [collapsed, setCollapsed] = React.useState(false);

    const history = useHistory();
    const { logout } = useContext<IAuthContext>(AuthContext);
    const { resources } = useContext<IResourceContext>(ResourceContext);

    const menuOnClick: MenuClickEventHandler = ({ key }) => {
        console.log(`clicked -> ${key}`);
        if (key === "logout") {
            logout({}).then(() => history.push("/login"));
        }
    };

    return (
        <AntLayout style={{ minHeight: "100vh" }}>
            <AntLayout.Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(collapsed) => setCollapsed(collapsed)}
            >
                <div
                    style={{
                        color: "#FFF",
                        fontSize: 16,
                        textAlign: "center",
                        height: 60,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    Brand Name
                </div>
                <Menu
                    onClick={menuOnClick}
                    theme="dark"
                    defaultSelectedKeys={["dashboard"]}
                    mode="inline"
                >
                    <Menu.Item key={`dashboard`} icon={<DashboardOutlined />}>
                        <Link to={`/`}>Dashboard</Link>
                    </Menu.Item>

                    {resources.map((item) => (
                        <Menu.Item
                            key={`resource-${item}`}
                            icon={<UnorderedListOutlined />}
                        >
                            <Link to={`/resources/${item}`}>
                                {humanizeString(item)}
                            </Link>
                        </Menu.Item>
                    ))}

                    <Menu.Item key="logout" icon={<LogoutOutlined />}>
                        Logout
                    </Menu.Item>
                </Menu>
            </AntLayout.Sider>
            <AntLayout className="site-layout">
                <AntLayout.Header
                    style={{ padding: 0, backgroundColor: "#FFF" }}
                />
                <AntLayout.Content>
                    <div style={{ padding: 24, minHeight: 360 }}>
                        {children}
                    </div>
                </AntLayout.Content>
            </AntLayout>
        </AntLayout>
    );
};