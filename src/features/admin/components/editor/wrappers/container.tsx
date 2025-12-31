
import React from "react";
import { useNode } from "@craftjs/core";

export const Container = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => {
    const { connectors: { connect, drag } } = useNode();
    return (
        <div ref={(ref) => { if (ref) connect(drag(ref)); }} className={`p-4 border border-dashed border-transparent hover:border-blue-500 min-h-[100px] ${className}`}>
            {children}
        </div>
    );
};

export const ContainerSettings = () => {
    return (
        <div>
            <p className="text-sm text-gray-500">No settings for this container.</p>
        </div>
    );
};

Container.craft = {
    displayName: "Container",
    related: {
        settings: ContainerSettings
    }
};
