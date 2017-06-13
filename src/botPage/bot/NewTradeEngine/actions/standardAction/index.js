export default function standardAction(type) {
    return (payload, error = false) => {
        const baseAction = {
            type,
            payload,
        };
        if (error) {
            return {
                ...baseAction,
                error: true,
            };
        }
        return baseAction;
    };
}
