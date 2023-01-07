#include <iostream>
using namespace std;
  
int main()
{
    int l_count = 5;
    for (int l_i = 0; l_i < 5; l_i++) {
        f_display("Hello World\n");
    }
    
    return 0;
}

void f_display(int p_message){
    cout << p_message;
}