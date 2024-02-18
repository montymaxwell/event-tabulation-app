import { useUser } from "../store";
import { supabase } from "../supabase";

export async function set_client_account () {
  const user = useUser.getState().value;
  if (user.id.length > 0) {
    const { error, data } = await supabase.from('clients').update({ user: user.id }).eq('id', user.client);

    if (error) {
      console.log("Client Account Set Error: ", error);
      return;
    }
  }
}

export async function get_client_account(): Promise<string | null> {
  const user = useUser.getState().value;
  if (user.id.length > 0) {
    const { error, data } = await supabase.from('clients').select('*').eq('user', user.id);
    
    if (error) {
      console.log('Client Account UserID Error: ', error);
      return null;
    }

    return data[0].owner;
  }
  else if (user.client !== null) {
    return user.client;
  }
  else {
    return null;
  }
}